import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ms from 'ms'

import {
  hashPassword,
  generateToken,
  getUserId,
  validateMobileNumber,
  generatePasswordResetEmail
} from '../utils'

const Mutation = {
  async register(_, args, { prisma, request }) {
    const email = args.data.email.toLowerCase()
    const emailExists = await prisma.$exists.user({ email })
    if (emailExists) {
      throw new Error(`"${email}" has been used`)
    }

    validateMobileNumber(args.data.mobile)

    const password = await hashPassword(args.data.password)

    const { id, name } = await prisma.createUser({
      ...args.data,
      email,
      password
    })

    return new Promise((resolve, reject) => {
      request.login({ id, name }, err => {
        if (err) { reject(err) }
        resolve(true)
      })
    })
  },

  async login(_, args, { prisma, request }) {
    const user = await prisma.user({ email: args.email.toLowerCase() })
    if (!user) {
      throw new Error('Invalid username or password')
    }
    const isMatch = await bcrypt.compare(args.password, user.password)
    if (!isMatch) {
      throw new Error('Invalid username or password')
    }

    return new Promise((resolve, reject) => {
      const { id, name } = user
      request.login({ id, name }, (err) => {
        if (err) reject(false)
        if (args.rememberMe) {
          request.session.cookie.maxAge = ms('30 days')
        }
        resolve(true)
      })
    })
  },

  updateProfile(_, args, { prisma, request }) {
    const id = getUserId(request)

    validateMobileNumber(args.data.mobile)

    return prisma.updateUser({
      where: { id },
      data: args.data
    }).then(() => { return true })
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
    if (!user) {
      return true
    }
    return new Promise((resolve, reject) => {
      mailgun.messages().send({
        from: 'Pepper <no-reply@pepper-hub.com>',
        to: user.email,
        subject: 'Resetting your Pepper Hub password',
        html: generatePasswordResetEmail(user.name, generateToken(user.id))
      }, (err) => {
        if (err) reject(err)
        resolve(true)
      })
    })
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
  }
}

export { Mutation as default }