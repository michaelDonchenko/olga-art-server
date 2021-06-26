const { Router } = require('express')
const { userAuth, adminCheck } = require('../middlewares/auth-middleware')
const {
  uploadProductImage,
  deleteProductImage,
} = require('../controllers/cloudinary')
const router = Router()

router.post('/product/upload-image', userAuth, adminCheck, uploadProductImage)
router.delete('/product/delete-image', userAuth, adminCheck, deleteProductImage)

module.exports = router
