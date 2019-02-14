import { GraphQLServer } from 'graphql-yoga'
import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import MemoryStore from 'memorystore'
import ms from 'ms'
import passport from 'passport'
import sgMail from '@sendgrid/mail'
import path from 'path'

import resolvers from './resolvers'
import { prisma } from '../prisma-client'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      ...request,
      prisma,
      sgMail
    }
  }
})

server.express.use(cookieParser())

const sessionStore = new (MemoryStore(session))({ checkPeriod: ms('1d') })

server.express.set('trust proxy', 1)
server.express.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
  store: sessionStore
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user({ id })
    if (!user) {
      done(null, false)
    } else {
      done(null, { id })
    }
  } catch (err) {
    done(err)
  }
})

server.express.use(passport.initialize())
server.express.use(passport.session())

server.express.use((req, res, next) => {
  // Extend expiration for client-side cookie for user chooses "Remember me"
  if (req.isAuthenticated() && req.session.cookie.originalMaxAge) {
    res.cookie(
      process.env.SESSION_NAME,
      req.cookies[process.env.SESSION_NAME],
      { maxAge: req.session.cookie.originalMaxAge }
    )
  }
  next()
})

if (process.env.NODE_ENV === 'production') {
  server.express.use(express.static('client/build'))
  server.express.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
  })
}

export { server as default }