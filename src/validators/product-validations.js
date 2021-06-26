const { check } = require('express-validator')

const name = check('name').not().isEmpty().withMessage('All fields required')
const price = check('price').not().isEmpty().withMessage('All fields required')
const quantity = check('quantity')
  .not()
  .isEmpty()
  .withMessage('All fields required')
const category = check('category')
  .not()
  .isEmpty()
  .withMessage('All fields required')
const description = check('description')
  .not()
  .isEmpty()
  .withMessage('All fields required')

module.exports = {
  createProductValidation: [name, price, quantity, category, description],
  updateProductValidation: [name, price, quantity, category, description],
}
