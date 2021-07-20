const User = require('../models/User')
const { v4: uuidv4 } = require('uuid')
const { sendMail } = require('./mail-sender')
const { SERVER_URL } = require('../constants')

//Register
exports.register = async (req, res) => {
  const { email, password } = req.body
  try {
    //generate random verification code
    let verificationCode = await uuidv4()

    let user = await User.create({ email, password, verificationCode })

    let html = `
      <h1>Hello ${user.email},</h1>
      <h2>Welcome to o-d-jewelry.com,</h2>
      <p>Please click the following link in order to activate your account</p>
      <a href="${SERVER_URL}/api/auth/verify-account/${user.verificationCode}">Verify Account</a>
      `

    //send mail to user
    await sendMail(
      user.email,
      'Account verification',
      'Please verify your account',
      html,
      'Email verification'
    )

    res.status(201).json({
      message: `The registration was succefull, please check your mailbox at ${user.email} in order to verify your account.`,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

//Login
exports.login = async (req, res) => {
  let user = req.user
  try {
    const token = await user.generateJWT()

    //send the user without the password field
    user.password = undefined

    res.status(201).cookie('token', token, { httpOnly: true }).json({
      message: 'Logged in succefully',
      user,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

//Verify account
exports.verifyAccount = async (req, res) => {
  let user = req.user
  try {
    //if the verification code is ok
    user.verificationCode = undefined
    user.verified = true

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'The user is verified',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

//Get all users
exports.allUsers = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const page = req.query.page ? parseInt(req.query.page) : 1
  try {
    const users = await User.find()
      .select('_id email role verified createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const count = await User.find().countDocuments()

    if (!users) {
      return res.status(404).json({
        success: false,
        message: 'Could not find users',
      })
    }

    return res.status(200).json({
      users,
      pages: Math.ceil(count / limit),
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

//logout
exports.logout = async (req, res) => {
  try {
    res.status(201).clearCookie('token', { httpOnly: true }).json({
      message: 'Logged out succefully',
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

//update user details
exports.updateDetails = async (req, res) => {
  let user = req.user
  const { userInfo } = req.body
  try {
    user.userInfo = userInfo

    await user.save()

    return res.status(200).json({ user, message: 'details updated succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}
