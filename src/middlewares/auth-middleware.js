const passport = require('passport')

exports.userAuth = passport.authenticate('jwt', { session: false })

exports.adminCheck = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res
      .status(401)
      .json({ message: 'Admin resourse only, Access denied.' })
  }

  next()
}
