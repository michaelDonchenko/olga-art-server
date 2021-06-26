const Product = require('../models/Product')
const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_NAME,
  CLOUDINARY_API_SECRET,
} = require('../constants')
const cloudinary = require('cloudinary')

//cloudinary config
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

exports.createProduct = async (req, res) => {
  const { name, price, quantity, category, description } = req.body
  try {
    let newProduct = await Product.create({
      name,
      price,
      quantity,
      category,
      description,
    })

    let productId = newProduct._id

    return res.status(201).json({ message: 'Product created', productId })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .sort([['createdAt', -1]])

    return res.status(201).json({ products })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.getProduct = async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findById(id).populate('category')

    return res.status(201).json({ product })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.updateProduct = async (req, res) => {
  const { id } = req.params
  try {
    await Product.findByIdAndUpdate(id, { ...req.body })

    return res.status(201).json({ message: 'Product updated succefully' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.deleteProduct = async (req, res) => {
  const { id } = req.params
  try {
    let product = await Product.findById(id)
    let { images } = product

    const forLoop = async (images) => {
      for (let i = 0; i < images.length; i++) {
        await cloudinary.uploader.destroy(
          images[i].public_id,
          async ({ result }) => {
            if (result !== 'ok') {
              return res
                .status(400)
                .json({ message: 'Could not delete the product.' })
            }
          }
        )
      }
    }

    images.length && (await forLoop(images))

    await product.deleteOne({ id })

    return res.status(201).json({ message: 'Product deleted succefully' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}
