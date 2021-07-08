const { Router } = require('express')
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getRandomProducts,
  addToWishlist,
} = require('../controllers/product')
const { userAuth, adminCheck } = require('../middlewares/auth-middleware')
const { validationMiddleware } = require('../middlewares/express-validator')
const {
  createProductValidation,
  updateProductValidation,
} = require('../validators/product-validations')
const router = Router()

router.post(
  '/create',
  createProductValidation,
  validationMiddleware,
  userAuth,
  adminCheck,
  createProduct
)
router.put(
  '/update/:id',
  updateProductValidation,
  validationMiddleware,
  userAuth,
  adminCheck,
  updateProduct
)
router.delete('/delete/:id', userAuth, adminCheck, deleteProduct)
router.get('/products', getProducts)
router.get('/product/:id', getProduct)
router.get('/get-random-products', getRandomProducts)
router.post('/add-to-wishlist', userAuth, addToWishlist)

module.exports = router
