const User = require('../models/User')
const { v4: uuidv4 } = require('uuid')
const { sendMail } = require('./mail-sender')
const { SERVER_URL, CLIENT_URL, PAYPAL_CLIENT_ID } = require('../constants')

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

//forgot password
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body
    let user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Email, The user does not exist.',
      })
    }

    //run resetpassword function
    user.generatePasswordReset()
    await user.save()

    //send reset password email to the user
    let html = `
    <h1>Hello ${user.email},</h1>
    <h2>Do you want to reset your password?</h2>
    <p>Please click the following link in order to reset your password, if you did not request to reset your password just ingore this email.</p>
    <a href="${CLIENT_URL}/password-reset/${user.resetPasswordToken}">Reset Password</a>
    `

    await sendMail(user.email, 'Reset password link', 'Reset password', html)

    return res.status(200).json({
      success: true,
      message:
        'Password reset link was succefully sent to your email, please check your mailbox for further instructions.',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

//forogot password validation
exports.passwordResetValidation = async (req, res) => {
  const { resetPasswordToken } = req.params
  try {
    let user = await User.findOne({ resetPasswordToken })
    const date = new Date()

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthoraized access, invalid verification code.',
      })
    }

    if (date > user.resetPasswordExpiresIn) {
      return res.status(401).json({
        success: false,
        message:
          'Your reset passwrod link has been expired, please get a new link in order to reset your password.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'The token is verified you may change your password now.',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

//reset password action
exports.passwordResetAction = async (req, res) => {
  const { password, confirmPassword, resetPasswordToken } = req.body

  try {
    let user = await User.findOne({ resetPasswordToken })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthoraized, invalid verification code.',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password has to be at least 8 characters',
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      })
    }

    user.password = password
    user.resetPasswordToken = undefined

    await user.save()

    return res.status(200).json({
      success: true,
      message:
        'Your password is saved you can now log-in with your new password.',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.getPaypalClientId = async (req, res) => {
  try {
    return res.status(200).json(PAYPAL_CLIENT_ID)
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}
