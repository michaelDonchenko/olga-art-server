const Message = require('../models/Message')

exports.createMessage = async (req, res) => {
  const { email, text } = req.body

  if (!email || !text) {
    return res.status(400).json({ message: 'All fields required' })
  }

  try {
    await Message.create({ email, text })

    return res.status(201).json({ message: 'Message was created succefully.' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}

exports.getMessages = async (req, res) => {
  //pagination variables
  const pageSize = Number(req.query.pageSize) || 6
  const page = Number(req.query.page) || 1

  try {
    const count = await Message.countDocuments()

    if (count === 0) {
      return res.status(404).json({ message: 'No messages found' })
    }

    const messages = await Message.find()
      .sort([['createdAt', -1]])
      .limit(parseInt(pageSize))
      .skip(pageSize * (page - 1))

    let pages = Math.ceil(count / pageSize)

    return res.status(200).json({ messages, pages, page })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred, for any issue please you can contact us.',
    })
  }
}
