const AdminDetails = require('../models/AdminDetails')

exports.documentExists = async (req, res, next) => {
  let document = await AdminDetails.findOne()

  if (!document) {
    let newDocument = await AdminDetails.create({})

    console.log('created new document')
    return newDocument
  }

  console.log('found document')
  return document
}
