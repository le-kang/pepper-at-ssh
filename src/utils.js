import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error('Password must be 8 characters or longer.')
  }

  return bcrypt.hash(password, 10)
}

const generateToken = userId => {
  return jwt.sign({ userId }, process.env.JWT_SECRET)
}

const getUserId = (request, requireAuth = true) => {
  const auth = request.get('Authorization')

  if (auth) {
    const token = auth.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded.userId
  }

  if (requireAuth) {
    throw new Error('Authentication failed')
  }

  return null
}

export { hashPassword, generateToken, getUserId }