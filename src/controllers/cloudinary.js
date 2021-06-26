const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_NAME,
  CLOUDINARY_API_SECRET,
} = require('../constants')
const cloudinary = require('cloudinary')
const Product = require('../models/Product')

//cloudinary config
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

//upload image
exports.uploadProductImage = async (req, res) => {
  let { array, id } = req.body

  if (!array.length) {
    return res.status(400).json({ message: 'Please choose an image to upload' })
  }

  try {
    let product = await Product.findById(id)

    const forLoop = async () => {
      for (let i = 0; i < array.length; i++) {
        await cloudinary.v2.uploader.upload(
          array[i],
          { folder: 'product-images' },
          async (error, result) => {
            if (error) {
              console.log(error)
              return res.status(400).json({
                success: false,
                message: 'Could not upload the image.',
              })
            }

            let { public_id, secure_url } = result

            product.images.push({ url: secure_url, public_id })
          }
        )
      }
      await product.save()
    }

    await forLoop()

    return res.status(201).json({
      message: 'Images was uploaded succefully',
      product,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

//delete image
exports.deleteProductImage = async (req, res) => {
  const { public_id, productId } = req.body

  try {
    let product = await Product.findById(productId)

    if (!product) {
      return res.status(400).json({
        message: 'Could not find the product',
      })
    }

    cloudinary.uploader.destroy(public_id, async ({ result }) => {
      //if cloudinary deleted the image
      if (result === 'ok') {
        let filtered = await product.images.filter(
          (image) => image.public_id !== public_id
        )

        product.images = filtered
        await product.save()

        return res.status(200).json({ message: 'Deleted succefully', product })
      }

      return res.status(400).json({ message: 'Could not delete the image' })
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
