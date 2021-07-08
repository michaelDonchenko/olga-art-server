const { Schema, model } = require('mongoose')
const { ObjectId } = Schema

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      maxlength: 32,
    },

    category: {
      type: ObjectId,
      ref: 'Category',
    },

    quantity: Number,

    sold: {
      type: Number,
      default: 0,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    wishlist: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

const Product = model('Product', productSchema)
module.exports = Product
