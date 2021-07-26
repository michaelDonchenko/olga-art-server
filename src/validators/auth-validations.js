const { check, param } = require('express-validator')
const { compare } = require('bcryptjs')
const User = require('../models/User')

//password
const password = check('password')
  .isLength({ min: 8, max: 15 })
  .withMessage('Password has to be between 8 and 15 characters.')

//email
const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email.')

//check if email exists
const emailExists = check('email').custom(async (value) => {
  const userExist = await User.findOne({ email: value })

  if (userExist) {
    throw new Error('User with that email already exists.')
  }
})

//check if password match
const passwordsMatch = check('password').custom(async (value, { req }) => {
  const match = value === req.body.confirmPassword

  if (!match) {
    throw new Error('The passwords do not match please try again.')
  }
})

//login validation
const loginFieldsCheck = check('email').custom(async (value, { req }) => {
  const password = req.body.password

  let user = await User.findOne({ email: value })

  if (!user) {
    throw new Error('User with that email does not exists.')
  }

  if (!user.verified) {
    throw new Error(
      'The user is not verified, in order to log-in please click the verification link at your mailbox.'
    )
  }

  const currectPasswrod = await compare(password, user.password)
  if (!currectPasswrod) {
    throw new Error('Invalid credentials.')
  }

  req.user = user
})

//verify account validation
const verificationValidator = param('verificationCode').custom(
  async (value, { req }) => {
    let user = await User.findOne({
      verificationCode: req.body.verificationCode,
    })

    if (!user) {
      throw new Error('Invalid verification code, User is not verified.')
    }

    req.user = user
  }
)

module.exports = {
  registerValidation: [email, password, emailExists, passwordsMatch],
  loginValidation: [email, password, loginFieldsCheck],
  verificationValidator: verificationValidator,
}
