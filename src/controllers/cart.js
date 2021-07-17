const Cart = require('../models/Cart')
const Product = require('../models/Product')
const { Types } = require('mongoose')

exports.saveCart = async (req, res) => {
  let user = req.user
  const { cart } = req.body
  const { products, delivery, paymentMethod } = cart
  try {
    // we have to create cart from our backend products in order to make sure
    // users did not change the price from localstorage
    //check if this user already has cart
    const cartExists = await Cart.findOne({ orderdBy: user._id })

    if (cartExists) {
      await cartExists.remove()
    }

    let productsFromDb = []

    async function createNewProductsArray(products) {
      for (let i = 0; i < products.length; i++) {
        let productObject = {}
        const productFromDb = await Product.findById(products[i]._id)
        productObject.product = productFromDb
        productObject.price = productFromDb.price
        productObject.count = products[i].count

        productsFromDb.push(productObject)
      }
    }

    await createNewProductsArray(products)

    //add delivey and payment prices to the cart total
    let total = 0
    let productsTotal = 0

    productsFromDb.reduce((currentValue, nextValue) => {
      return (productsTotal = Number(
        currentValue + nextValue.price * nextValue.count
      ))
    }, 0)

    let deliveryPrice =
      delivery === 'regular'
        ? 16
        : delivery === 'boxit'
        ? 26
        : delivery === 'express'
        ? 59
        : 0

    total = productsTotal + deliveryPrice

    if (paymentMethod === 'paypal') {
      total = Math.round(total * 1.05)
    }

    const newCart = await Cart.create({
      products: productsFromDb,
      deliveryOption: delivery,
      paymentMethod,
      cartTotal: total,
      orderdBy: user._id,
    })

    res
      .status(200)
      .json({ message: 'Cart created succefully on DB', cartId: newCart._id })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.getCart = async (req, res) => {
  let user = req.user
  let { id } = req.params

  try {
    let userCart = await Cart.findById(id).populate('products.product')

    if (!userCart) {
      return res
        .status(400)
        .json({ message: 'There was an error with your cart please try again' })
    }

    if (String(user._id) !== String(userCart.orderdBy)) {
      return res.status(401).json({ message: 'You cannt access this cart' })
    }

    res
      .status(200)
      .json({ cart: userCart, message: 'Cart loaded succefully from backend' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}
