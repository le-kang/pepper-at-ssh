import bcrypt from 'bcryptjs'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { prisma } from '../prisma-client'

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user({ id })
    if (!user) {
      done(null, false)
    } else {
      const { name } = user
      done(null, { id, name })
    }
  } catch (err) {
    done(err)
  }
})

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await prisma.user({ email: email.toLowerCase() })
    if (!user) {
      return done(null, false, 'Invalid username or password')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const { id, name } = user
      return done(null, { id, name })
    }
    return done(null, false, 'Invalid username or password')
  } catch (err) {
    return done(err)
  }
}))
