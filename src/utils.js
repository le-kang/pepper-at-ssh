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


/**
 * This is a debug function that simulates a python sleep function 
 * by using async and await keyword
 * e.g await sleep(5) will sleep for 5 seconds
 * @param {number} s Time for sleep
 */
const sleep = (s) => {
  return new Promise(resolve => setTimeout(resolve, s * 1000))
}

export { hashPassword, getUserId, validateMobileNumber, sleep }