import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ms from 'ms'
import { validate as isEmailValid } from 'email-validator'

import {
  hashPassword,
  generateToken,
  getUserId,
  validateMobileNumber,
  generateRegistrationEmail,
  generatePasswordResetEmail,
  generateQRCodeEmail,
  generateSurveyLinkEmail,
  generateRegistrationConfirmationEmail
} from '../utils'

const Mutation = {
  async createTempUser(_, args, { prisma, mailgun }) {
    if (args.secret !== process.env.ROBOT_SECRET) {
      throw new Error('Authentication failed')
    }
    if (!isEmailValid(args.data.email)) {
      throw new Error(`"${args.data.email}" is not a valid email address`)
    }
    const email = args.data.email.toLowerCase()
    const emailExists = await prisma.$exists.user({ email })
    if (emailExists) {
      throw new Error(`"${email}" has been used`)
    }

    validateMobileNumber(args.data.mobile)

    const user = await prisma.createUser({
      ...args.data,
      email
    })

    mailgun.messages().send({
      to: email,
      from: 'Pepper <pepper@pepper-hub.com>',
      subject: 'Your Pepper Hub registration is one step away',
      html: generateRegistrationEmail(user.name, user.id)
    })

    return user.id
  },

  async register(_, args, { prisma, request, mailgun }) {
    if (!isEmailValid(args.data.email)) {
      throw new Error(`"${args.data.email}" is not a valid email address`)
    }
    const email = args.data.email.toLowerCase()

    const { name, mobile, companyName } = args.data

    validateMobileNumber(mobile)

    const password = await hashPassword(args.data.password)
    let user
    if (args.data.id) {
      user = await prisma.updateUser({
        where: { id: args.data.id },
        data: {
          password,
          mobile,
          companyName,
          verified: true
        }
      })

      mailgun.messages().send({
        to: user.email,
        from: 'Pepper <pepper@pepper-hub.com>',
        subject: 'Your registration with Pepper Hub is completed',
        html: generateRegistrationConfirmationEmail(user)
      })
    } else {
      const emailExists = await prisma.$exists.user({ email })
      if (emailExists) {
        throw new Error(`"${email}" has been used`)
      }
      user = await prisma.createUser({
        name,
        email,
        password,
        mobile,
        companyName
      })
      mailgun.messages().send({
        to: user.email,
        from: 'Pepper <pepper@pepper-hub.com>',
        subject: 'Your QR code to login with Pepper robot',
        html: generateQRCodeEmail(user.name, 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + user.id)
      })
    }

    return new Promise((resolve, reject) => {
      request.login({ id: user.id }, err => {
        if (err) { reject(err) }
        resolve(user)
      })
    })
  },

  async login(_, args, { prisma, request }) {
    const user = await prisma.user({ email: args.email.toLowerCase() })
    if (!user) {
      throw new Error('Invalid username or password')
    }
    if (user.deactivated) {
      throw new Error('This account has been deactivated, please contact us if you would like to reactivate')
    }
    if (!user.password) {
      throw new Error('Please complete your registration by following the registration link we sent to your email address')
    }
    const isMatch = await bcrypt.compare(args.password, user.password)
    if (!isMatch) {
      throw new Error('Invalid username or password')
    }

    return new Promise((resolve, reject) => {
      request.login({ id: user.id }, (err) => {
        if (err) reject(false)
        if (args.rememberMe) {
          request.session.cookie.maxAge = ms('30 days')
        }
        resolve(user)
      })
    })
  },

  updateProfile(_, args, { prisma, request }) {
    const id = args.id || getUserId(request)

    validateMobileNumber(args.data.mobile)

    return prisma.updateUser({
      where: { id },
      data: args.data
    })
  },

  async sendQRCode(_, args, { prisma, request, mailgun, twilioClient }) {
    const id = getUserId(request)
    const user = await prisma.user({ id })
    if (args.to === 'email') {
      mailgun.messages().send({
        to: user.email,
        from: 'Pepper <pepper@pepper-hub.com>',
        subject: 'Your QR code to login with Pepper robot',
        html: generateQRCodeEmail(user.name, 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + user.id)
      })
      return true
    } else if (args.to === 'mobile') {
      if (!user.mobile) {
        throw new Error('Please provide your mobile number by updating your profile')
      }
      twilioClient.messages
        .create({
          from: 'Pepper Hub',
          body: 'Click following link to get your QR Code: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + user.id,
          to: '+614' + user.mobile
        })
      return true
    }
  },

  async sendSurveyLink(_, args, { prisma, mailgun }) {
    const user = await prisma.user({ id: args.id })
    if (!user) return false
    mailgun.messages().send({
      to: user.email,
      from: 'Pepper <pepper@pepper-hub.com>',
      subject: 'Your survey invitation for Pepper Hub',
      html: generateSurveyLinkEmail(user)
    })
    return true
  },

  async changePassword(_, args, { prisma, request }) {
    const id = getUserId(request)
    const { password } = await prisma.user({ id })
    const isMatch = await bcrypt.compare(args.currentPassword, password)
    if (!isMatch) {
      throw new Error('Provided current password is invalid')
    }
    const newPassword = await hashPassword(args.newPassword)
    return prisma.updateUser({
      where: { id },
      data: { password: newPassword }
    }).then(() => { return true })
  },

  logout(_, args, { request, response }) {
    request.logout()
    request.session.destroy()
    response.clearCookie(process.env.SESSION_NAME)
    return true
  },

  async forgotPassword(_, args, { prisma, mailgun }) {
    const user = await prisma.user({ email: args.email.toLowerCase() })
    if (!user || !user.password) {
      return true
    }
    mailgun.messages().send({
      to: user.email,
      from: 'Pepper <pepper@pepper-hub.com>',
      subject: 'Resetting your Pepper Hub password',
      html: generatePasswordResetEmail(user.name, generateToken(user.id))
    })
    return true
  },

  async resetPassword(_, args, { prisma }) {
    try {
      const { userId: id } = jwt.verify(args.token, process.env.JWT_SECRET)
      const password = await hashPassword(args.password)
      return prisma.updateUser({
        where: { id },
        data: { password }
      }).then(() => { return true })
    } catch (err) {
      throw new Error('Token is invalid or expired')
    }
  },

  async deactivateAccount(_, args, { request, response, prisma }) {
    const id = getUserId(request)

    return prisma.updateUser({
      where: { id },
      data: { deactivated: true }
    }).then(() => {
      request.logout()
      request.session.destroy()
      response.clearCookie(process.env.SESSION_NAME)
      return true
    })
  }
}

export { Mutation as default }