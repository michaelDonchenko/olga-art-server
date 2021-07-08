const { Schema, model } = require('mongoose')

const AdminDetailsSchema = new Schema({
  banner: {
    url: String,
    public_id: String,
  },

  profileImage: {
    url: String,
    public_id: String,
  },

  about: String,

  siteRules: String,
})

const AdminDetails = model('AdminDetails', AdminDetailsSchema)
module.exports = AdminDetails
