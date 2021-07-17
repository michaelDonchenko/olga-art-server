const { Schema, model } = require('mongoose')
const { ObjectId } = Schema

const CartSchema = new Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
        },
        count: Number,
        price: Number,
      },
    ],

    deliveryOption: String,
    paymentMethod: String,
    cartTotal: Number,
    totalAfterDiscount: Number,

    orderdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Cart = model('Cart', CartSchema)
module.exports = Cart
