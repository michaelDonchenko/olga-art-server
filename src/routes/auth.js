const { Router } = require('express')
const {
  register,
  login,
  verifyAccount,
  allUsers,
  logout,
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

module.exports = router
