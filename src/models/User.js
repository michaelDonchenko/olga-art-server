const { Schema, model } = require('mongoose')
const { ObjectId } = Schema
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')
const { randomBytes } = require('crypto')

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
      required: false,
    },

    resetPasswordToken: {
      type: String,
      required: false,
    },

    resetPasswordExpiresIn: {
      type: Date,
      required: false,
    },

    role: {
      type: String,
      default: 'subscriber',
    },

    cart: {
      type: ObjectId,
      ref: 'Cart',
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
  },
  { timestamps: true }
)

//methods
UserSchema.pre('save', async function (next) {
  let user = this
  //if password did not change return next
  if (!user.isModified('password')) return next()

  //else if password changed
  user.password = await hash(user.password, 10)
  next()
})

UserSchema.methods.generateJWT = async function () {
  let payload = {
    id: this._id,
    email: this.email,
    role: this.role,
  }
  return await sign(payload, SECRET)
}

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordExpiresIn = Date.now() + 3600000
  this.resetPasswordToken = randomBytes(20).toString('hex')
}

const User = model('User', UserSchema)
module.exports = User
