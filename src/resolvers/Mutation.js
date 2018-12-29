import bcrypt from 'bcryptjs'
import { hashPassword, generateToken, getUserId } from '../utils'

const Mutation = {
  async signup(_, args, { prisma }) {
    const password = await hashPassword(args.data.password)
    const user = await prisma.createUser({
      ...args.data,
      password
    })

    return {
      user,
      token: generateToken(user.id)
    }
  },
  async login(_, args, { prisma }) {
    const user = await prisma.user({
      email: args.data.email
    })

    if (!user) {
      throw new Error('Invalid username or password!')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error('Invalid username or password!')
    }

    return {
      user,
      token: generateToken(user.id)
    }
  },
  async updateProfile(_, args, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.updateUser({
      where: { id: userId },
      data: args.data
    }, info)
  }
}

export { Mutation as default }