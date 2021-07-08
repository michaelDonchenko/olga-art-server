const { Schema, model } = require('mongoose')

const MessageSchema = new Schema(
  {
    email: String,
    text: String,
  },
  { timestamps: true }
)

const Category = model('Message', MessageSchema)
module.exports = Category
