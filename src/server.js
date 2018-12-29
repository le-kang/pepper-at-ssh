import { GraphQLServer } from 'graphql-yoga'
import resolvers from './resolvers'
import { prisma } from '../prisma-client'
import express from 'express'
import path from 'path'

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      ...request,
      prisma
    }
  }
})

if (process.env.NODE_ENV === 'production') {
  server.express.use(express.static('client/build'))
  server.app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
  })
}

export { server as default }