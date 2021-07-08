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
    cartTotal: Number,
    deliveryPrice: Number,
    paymentMethod: String,
    totalAfterDiscount: Number,
    orderdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

module.exports = model('Cart', CartSchema)
