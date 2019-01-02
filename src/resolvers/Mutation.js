import bcrypt from 'bcryptjs'
import passport from 'passport'
import { hashPassword, getUserId, validateMobileNumber } from '../utils'

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
  login(_, args, { request }) {
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user) => {
        if (err) reject(err)
        if (!user) reject('Invalid username or password')
        console.log(user)
        request.login(user, () => {
          resolve(true)
        })
      })({ body: args })
    })
  },
  updateProfile(_, args, { prisma, request }) {
    const id = getUserId(request)

    validateMobileNumber(args.data.mobile)

    return prisma.updateUser({
      where: { id },
      data: args.data
    })
  },
  async changePassword(_, args, { prisma, request }) {
    const id = getUserId(request)
    const { password } = await prisma.user({ id })
    const isMatch = await bcrypt.compare(args.old, password)
    if (!isMatch) {
      throw new Error('Invalid old password')
    }
    const newPassword = await hashPassword(args.new)
    return prisma.updateUser({
      where: { id },
      data: { password: newPassword }
    }).then(() => { return true })
  },
  logout(_, args, { request }) {
    request.logout()
    return true
  }
}

export { Mutation as default }