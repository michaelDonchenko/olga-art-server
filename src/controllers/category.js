const Category = require('../models/Category')

exports.createCategory = async (req, res) => {
  const name = req.body.name

  if (!name) {
    return res.status(400).json({
      message: 'Name is required',
    })
  }
  try {
    await Category.create({ name })

    res.status(201).json({
      message: 'Category created',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.updateCategory = async (req, res) => {
  const id = req.params.id
  try {
    await Category.findByIdAndUpdate(id, { name: req.body.name })

    res.status(201).json({
      message: 'Category updated',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.deleteCategory = async (req, res) => {
  const id = req.params.id
  try {
    await Category.findByIdAndDelete(id)

    res.status(201).json({
      message: 'Category deleted',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()

    res.status(201).json({
      categories,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}
