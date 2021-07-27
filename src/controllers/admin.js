const AdminDetails = require('../models/AdminDetails')
const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_NAME,
  CLOUDINARY_API_SECRET,
  TINY_API_KEY,
} = require('../constants')
const cloudinary = require('cloudinary')
const { documentExists } = require('../middlewares/admin-details-middleware')

//cloudinary config
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

exports.uploadBannerImage = async (req, res) => {
  const { image } = req.body
  let document = await documentExists()

  if (!image) {
    return res.status(400).json({ message: 'No image was choosen' })
  }
  try {
    if (document.banner.public_id) {
      await cloudinary.uploader.destroy(
        document.banner.public_id,
        async ({ result }) => {
          if (result !== 'ok') {
            return res.status(400).json('Could not update the banner image')
          }

          document.banner = undefined
          await document.save()
          console.log('image deleted succefully')
        }
      )
    }

    await cloudinary.v2.uploader.upload(
      image,
      { folder: 'admin-details' },
      async (error, result) => {
        if (error) {
          console.log(error)
          return res.status(400).json({
            success: false,
            message: 'Could not upload the image.',
          })
        }

        let { public_id, secure_url } = result
        document.banner = { url: secure_url, public_id }

        await document.save()
      }
    )
    return res.status(200).json({ message: 'Banner image changed' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.uploadProfileImage = async (req, res) => {
  const { image } = req.body
  let document = await documentExists()

  if (!image) {
    return res.status(400).json({ message: 'No image was choosen' })
  }
  try {
    if (document.profileImage.public_id) {
      await cloudinary.uploader.destroy(
        document.profileImage.public_id,
        async ({ result }) => {
          if (result !== 'ok') {
            return res.status(400).json('Could not update the profile image')
          }

          document.profileImage = undefined
          await document.save()
          console.log('image deleted succefully')
        }
      )
    }

    await cloudinary.v2.uploader.upload(
      image,
      { folder: 'admin-details' },
      async (error, result) => {
        if (error) {
          console.log(error)
          return res.status(400).json({
            success: false,
            message: 'Could not upload the image.',
          })
        }

        let { public_id, secure_url } = result
        document.profileImage = { url: secure_url, public_id }

        await document.save()
      }
    )
    return res.status(200).json({ message: 'Profile image changed' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.displayBanner = async (req, res) => {
  try {
    const document = await AdminDetails.findOne()

    if (!document) {
      return res.status(404).json({ message: 'No document yet' })
    }

    if (!document.banner.url) {
      return res.status(404).json({ message: 'No banner yet' })
    }

    return res.status(200).json({ document })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.displayProfileImage = async (req, res) => {
  try {
    const document = await AdminDetails.findOne()

    if (!document) {
      return res.status(404).json({ message: 'No document yet' })
    }

    if (!document.profileImage.url) {
      return res.status(404).json({ message: 'No profile image yet' })
    }

    return res.status(200).json({ document })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.getAboutMe = async (req, res) => {
  try {
    const document = await AdminDetails.findOne()

    if (!document) {
      return res.status(404).json({ message: 'No document yet' })
    }

    if (!document.about) {
      return res.status(404).json({ message: 'No about me yet' })
    }

    return res.status(200).json({ document })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.updateAboutMe = async (req, res) => {
  let document = await documentExists()

  const { text } = req.body

  if (!text) {
    return res.status(400).json({ message: 'No text provided' })
  }

  try {
    document.about = text
    await document.save()

    return res.status(200).json({ message: 'About me updated succefully.' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.getSiteRules = async (req, res) => {
  try {
    const document = await AdminDetails.findOne()

    if (!document) {
      return res.status(404).json({ message: 'No document yet' })
    }

    if (!document.siteRules) {
      return res.status(404).json({ message: 'No Site rules yet' })
    }

    return res.status(200).json({ document })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.updateSiteRules = async (req, res) => {
  let document = await documentExists()

  const { text } = req.body

  if (!text) {
    return res.status(400).json({ message: 'No text provided' })
  }

  try {
    document.siteRules = text
    await document.save()

    return res.status(200).json({ message: 'Site rules updated succefully.' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.sendTinyApiKey = async (req, res) => {
  try {
    return res.status(200).json({ tinyApiKey: TINY_API_KEY })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}
