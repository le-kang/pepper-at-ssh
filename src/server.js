import { GraphQLServer } from 'graphql-yoga'
import express from 'express'
import session from 'cookie-session'
import passport from 'passport'
import path from 'path'

import './passport-config'
import resolvers from './resolvers'
import { prisma } from '../prisma-client'

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

server.express.use(session({
  secret: process.env.SESSION_SECRET
}))

server.express.use(passport.initialize())
server.express.use(passport.session())

if (process.env.NODE_ENV === 'production') {
  server.express.use(express.static('client/build'))
  server.app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
  })
}

export { server as default }