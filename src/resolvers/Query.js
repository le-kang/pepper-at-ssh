import { getUserId } from '../utils'

const Query = {
  me(_, args, { request }) {
    return request.user
  },
  profile(_, args, { prisma, request }) {
    const id = getUserId(request)
    return prisma.user({ id })
  }
}

export { Query as default }