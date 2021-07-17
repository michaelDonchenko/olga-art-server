const { Router } = require('express')
const { userAuth } = require('../middlewares/auth-middleware')
const router = Router()
const { saveCart, getCart } = require('../controllers/cart')

router.post('/save-cart', userAuth, saveCart)
router.get('/get-cart/:id', userAuth, getCart)

module.exports = router
