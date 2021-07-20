const { Schema, model } = require('mongoose')
const { ObjectId } = Schema

const OrderSchema = new Schema(
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

    orderStatus: {
      type: String,
      default: 'Not Processed',
      enum: ['Not Processed', 'Order Sent', 'Cancelled', 'Delivered'],
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    userInfo: {
      email: String,
      name: String,
      phone: String,
      country: String,
      city: String,
      street: String,
      zipCode: String,
      homeNumber: String,
      apartment: String,
    },

    trackNumber: { type: String, default: '' },
    url: { type: String, default: '' },
    orderdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Order = model('Order', OrderSchema)
module.exports = Order
