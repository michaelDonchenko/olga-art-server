const Product = require('../models/Product')
const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_NAME,
  CLOUDINARY_API_SECRET,
} = require('../constants')
const cloudinary = require('cloudinary')
const Category = require('../models/Category')
const { ConnectionStates } = require('mongoose')

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
  //query params
  const categoriesQuery = await Category.find()
  let categories = []
  const createCategoriesArray = async () => {
    for (let i = 0; i < categoriesQuery.length; i++) {
      categories.push(categoriesQuery[i]._id)
    }
  }

  await createCategoriesArray()

  const quantity = req.query.quantity || Infinity
  const category = req.query.category || categories
  const productsToDisplay = req.query.products || 'all'
  let sort = req.query.sort || 'createdAt'
  let order = -1
  //pagination variables
  const pageSize = Number(req.query.pageSize) || 6
  const page = Number(req.query.page) || 1

  let productsFilter = {}

  if (productsToDisplay === 'all') {
    productsFilter = { $gte: 0 }
  }
  if (productsToDisplay === 'inStock') {
    productsFilter = { $gte: 1 }
  }
  if (productsToDisplay === 'outStock') {
    productsFilter = { $lte: 0 }
  }

  let queryOBJ = {
    quantity: productsFilter,
    category: category,
  }

  if (req.query.sort === 'high price') {
    sort = 'price'
  }

  if (req.query.sort === 'low price') {
    sort = 'price'
    order = 1
  }

  try {
    const count = await Product.countDocuments(queryOBJ)
    const products = await Product.find(queryOBJ)
      .populate('category')
      .sort([[sort, order]])
      .limit(parseInt(pageSize))
      .skip(pageSize * (page - 1))

    let pages = Math.ceil(count / pageSize)

    return res.status(201).json({ products, pages, page })
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
  let images = []

  try {
    const product = await Product.findById(id).populate('category')

    if (product.images.length > 0) {
      product.images.map((p) =>
        images.push({ original: p.url, thumbnail: p.url })
      )
    }

    return res.status(201).json({ product, images })
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

exports.getRandomProducts = async (req, res) => {
  try {
    let count = await Product.countDocuments()
    if (count === 0) {
      return res.status(400).json({ message: 'No products yet' })
    }

    let numbers = []
    let limit = count < 5 ? count : 5

    const getRandomNumbers = async () => {
      for (let i = 0; i < limit; i++) {
        let num = Math.floor(Math.random() * count)
        if (numbers.includes(num) === true) {
          i--
        }
        if (numbers.includes(num) === false) {
          numbers.push(num)
        }
      }
    }

    await getRandomNumbers()

    let products = await Product.find()
    let productsToSend = []

    const randomProducts = async (numbers) => {
      for (let i = 0; i < limit; i++) {
        productsToSend.push(products[numbers[i]])
      }
    }

    await randomProducts(numbers)

    return res.status(200).json({ products: productsToSend })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.addToWishlist = async (req, res) => {
  const user = req.user
  const { productId } = req.body

  try {
    let product = await Product.findById(productId)

    let userIdIndex = product.wishlist.indexOf(user._id)

    //if user not found
    if (userIdIndex === -1) {
      product.wishlist.push(user._id)
      await product.save()

      return res.status(200).json({ message: 'Product added to wishlist' })
    }

    //if user found remove id from wishlist array
    product.wishlist.splice(userIdIndex, 1)

    await product.save()
    return res.status(200).json({ message: 'Product deleted from wishlist' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.adminProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  try {
    const count = await Product.countDocuments()
    const products = await Product.find()
      .populate('category')
      .sort([['createdAt', -1]])
      .limit(6)
      .skip(6 * (page - 1))

    let pages = Math.ceil(count / 6)

    return res.status(201).json({ products, pages, page })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}
