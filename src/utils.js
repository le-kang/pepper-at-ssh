import bcrypt from 'bcryptjs'

const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error('Password must be 8 characters or longer')
  }

  return bcrypt.hash(password, 10)
}

const getUserId = (request) => {
  const { user } = request

  if (!user) {
    throw new Error('Authentication failed')
  }

  return user.id
}

const validateMobileNumber = (number) => {
  const re = RegExp('^(04)[0-9]{8}$')
  if (number && !re.test(number)) {
    throw new Error('Invalid Australian mobile number')
  }
}

export { hashPassword, getUserId, validateMobileNumber }