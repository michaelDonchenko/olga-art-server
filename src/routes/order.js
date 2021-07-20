const { Router } = require('express')
const {
  createOrder,
  getOrder,
  getOrders,
  getUserOrders,
  paypalPayment,
  updateOrderStatus,
} = require('../controllers/order')
const { userAuth, adminCheck } = require('../middlewares/auth-middleware')

const router = Router()

router.post('/create-order', userAuth, createOrder)
router.get('/get-order/:id', userAuth, getOrder)
router.get('/get-orders', userAuth, adminCheck, getOrders)
router.get('/get-user-orders', userAuth, getUserOrders)
router.get('/paypal-payment/:id', userAuth, paypalPayment)
router.put('/update-order/:id', userAuth, adminCheck, updateOrderStatus)

module.exports = router
