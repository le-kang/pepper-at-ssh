const Query = {
  user(_, args, { prisma, request }) {
    if (args.id) {
      return prisma.user({ id: args.id })
    } else {
      if (!request.user) {
        return null
      }
      return prisma.user({ id: request.user.id })
    }
  }
}

export { Query as default }