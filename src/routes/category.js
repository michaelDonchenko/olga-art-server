const { Router } = require('express')
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require('../controllers/category')
const { userAuth, adminCheck } = require('../middlewares/auth-middleware')
const router = Router()

router.post('/create', userAuth, adminCheck, createCategory)
router.put('/update/:id', userAuth, adminCheck, updateCategory)
router.delete('/delete/:id', userAuth, adminCheck, deleteCategory)
router.get('/categories', getCategories)

module.exports = router
