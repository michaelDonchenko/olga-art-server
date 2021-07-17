const { Router } = require('express')
const {
  createOrder,
  getOrder,
  getOrders,
  getUserOrders,
} = require('../controllers/order')
const { userAuth, adminCheck } = require('../middlewares/auth-middleware')

const router = Router()

router.post('/create-order', userAuth, createOrder)
router.get('/get-order/:id', userAuth, getOrder)
router.get('/get-orders', userAuth, adminCheck, getOrders)
router.get('/get-user-orders', userAuth, getUserOrders)

module.exports = router
