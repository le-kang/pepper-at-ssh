import { GraphQLServer } from 'graphql-yoga'
import prisma from '../prisma-client'

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  context(request) {
    return {
      prisma,
      request
    }
  }
})

export { server as default }