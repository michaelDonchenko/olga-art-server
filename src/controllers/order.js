const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')

exports.createOrder = async (req, res) => {
  let user = req.user
  try {
    const cartFromDb = await Cart.findOne({ orderdBy: user._id })

    const order = await Order.create({
      products: cartFromDb.products,
      deliveryOption: cartFromDb.deliveryOption,
      paymentMethod: cartFromDb.paymentMethod,
      cartTotal: cartFromDb.cartTotal,
      userInfo: user.userInfo,
      orderdBy: user._id,
    })

    // decrement quantity, increment sold
    let bulkOption = cartFromDb.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      }
    })

    // console.log(bulkOption)
    await Product.bulkWrite(bulkOption, {})

    res.status(201).json({ message: 'Order created', orderId: order._id })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.getOrder = async (req, res) => {
  const user = req.user
  const { id } = req.params
  try {
    const order = await Order.findById(id).populate('products.product')

    if (!order) {
      return res
        .status(404)
        .json({ message: 'There was an error could not find the order' })
    }

    if (String(user._id) !== String(order.orderdBy)) {
      return res.status(401).json({ message: 'You cannt access this order' })
    }

    return res.status(200).json({ order })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.getOrders = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 8
  const page = req.query.page ? parseInt(req.query.page) : 1

  try {
    const orders = await Order.find()
      .populate('products.product')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const count = await Order.find().countDocuments()

    if (!orders) {
      return res.status(404).json({
        success: false,
        message: 'Could not find orders',
      })
    }

    return res.status(200).json({
      orders,
      pages: Math.ceil(count / limit),
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.getUserOrders = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 8
  const page = req.query.page ? parseInt(req.query.page) : 1

  const user = req.user

  try {
    const orders = await Order.find({ orderdBy: user._id })
      .populate('products.product')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const count = await Order.find({ orderdBy: user._id }).countDocuments()

    if (!orders) {
      return res.status(404).json({
        success: false,
        message: 'Could not find orders',
      })
    }

    return res.status(200).json({
      orders,
      pages: Math.ceil(count / limit),
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}
