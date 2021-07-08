const { Router } = require('express')
const { createMessage, getMessages } = require('../controllers/message')
const { userAuth, adminCheck } = require('../middlewares/auth-middleware')

const router = Router()

router.post('/create', createMessage)
router.get('/get-messages', userAuth, adminCheck, getMessages)

module.exports = router
