import { getUserId } from '../utils'

const Query = {
  me(_, args, { prisma, request }) {
    const userId = getUserId(request)

    return prisma.user({ id: userId })
  }
}

export { Query as default }