import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error('Password must be 8 characters or longer')
  }

  return bcrypt.hash(password, 10)
}

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const getUserId = (request) => {
  const { user } = request

  if (!user) {
    throw new Error('Authentication failed')
  }

  return user.id
}

/**
 * Check if last 8 digits of the string are all numbers in order to 
 * be affixed after "04" to form a valid Australian mobile number 
 * @param {string} number 
 */
const validateMobileNumber = (number) => {
  const re = RegExp('^[0-9]{8}$')
  if (number && !re.test(number)) {
    throw new Error('Invalid Australian mobile number')
  }
}


/**
 * This is a debug function that simulates a python sleep function 
 * by using async and await keyword
 * e.g await sleep(5) will sleep for 5 seconds
 * @param {number} s Time for sleep
 */
const sleep = (s) => {
  return new Promise(resolve => setTimeout(resolve, s * 1000))
}

export { hashPassword, generateToken, getUserId, validateMobileNumber, sleep }