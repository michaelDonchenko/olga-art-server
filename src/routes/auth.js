const { Router } = require('express')
const {
  register,
  login,
  verifyAccount,
  allUsers,
  logout,
  updateDetails,
  forgotPassword,
  passwordResetValidation,
  passwordResetAction,
} = require('../controllers/auth')
const { validationMiddleware } = require('../middlewares/express-validator')
const {
  registerValidation,
  loginValidation,
  verificationValidator,
} = require('../validators/auth-validations')
const { userAuth, adminCheck } = require('../middlewares/auth-middleware')
const router = Router()

router.post('/register', registerValidation, validationMiddleware, register)
router.post('/login', loginValidation, validationMiddleware, login)
router.get(
  '/verify-account/:verificationCode',
  verificationValidator,
  validationMiddleware,
  verifyAccount
)
router.get('/users', userAuth, adminCheck, allUsers)
router.get('/logout', logout)
router.post('/update-details', userAuth, updateDetails)

//forgot password endpoint
router.post('/forgot-password', forgotPassword)

//reset password validation
router.get(
  '/password-reset-validation/:resetPasswordToken',
  passwordResetValidation
)

//reset password action
router.post('/password-reset', passwordResetAction)

module.exports = router
