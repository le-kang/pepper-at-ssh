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

const generateRegistrationEmail = (name, userId) => {
  return `<p style="margin-bottom: 1em">Dear ${name}, </p>
  <p style="margin-bottom: 1em">Please complete your registration by following this link: </p>
  <a href="${process.env.HOST_ADDRESS}/register/${userId}">${process.env.HOST_ADDRESS}/register/${userId}</a>
  <p>Thank you!</p>
  <p>Pepper Hub</p>
  `
}

const generatePasswordResetEmail = (name, token) => {
  return `<p style="margin-bottom: 1em">Dear ${name}, </p>
  <p style="margin-bottom: 1em">Someone has requested a link to reset the password for your account. 
  If you did not request a password reset, you can ignore this email. 
  No changes have been made to your account.</p>
  <p style="margin-bottom: 1em">To reset your password, follow this link (or paste into your browser) within the next 60 minutes: </p>
  <a href="${process.env.HOST_ADDRESS}/reset-password/${token}">${process.env.HOST_ADDRESS}/reset-password/${token}</a>
  <p>Thank you!</p>
  <p>Pepper Hub</p>
  `
}

const generateQRCodeEmail = (name, url) => {
  return `<p style="margin-bottom: 1em">Dear ${name}, </p>
  <p style="margin-bottom: 1em">Here is your QR code which you can use to login with Pepper at Sydney Startup Hub.</p>
  <img width="250" height="250" alt="QR Code" src="${url}" />
  <p>Thank you!</p>
  <p>Pepper Hub</p>
  `
}

const generateRegistrationConfirmationEmail = (name, email, loginWith, freeCoffee) => {
  return `<p style="margin-bottom: 1em">Dear ${name}, </p>
  <p style="margin-bottom: 1em">Thank you for registering with Pepper Hub.</p>
  <p style="margin-bottom: 1em">Your Pepper Hub website login is <strong>${email}</strong>.</p>
  <p style="margin-bottom: 1em">To access Pepper Hub services on Pepper, 
  you are using <strong>${loginWith === 'face_id' ? 'face identification' : 'QR code'}</strong>.</p>
  ${freeCoffee ? '<p style="margin-bottom: 1em">Please show this registration email to the researchers next to reception to receive your free coffee vouchers.'
      + ' The researchers are available from 10am to 4pm from 20-Feb-2019 to 27-Feb-2019. '
      + 'If you cannot find the researchers, please email to jonathan.vitale@uts.edu.au.</p>' : ''}
  <p>Thank you!</p>
  <p>Pepper Hub</p>
  `
}

export {
  hashPassword,
  generateToken,
  getUserId,
  validateMobileNumber,
  sleep,
  generateRegistrationEmail,
  generatePasswordResetEmail,
  generateQRCodeEmail,
  generateRegistrationConfirmationEmail
}