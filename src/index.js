const express = require('express')
const app = express()
const { PORT, CLIENT_URL } = require('./constants')
require('./db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const passport = require('passport')

//import passport middleware
require('./middlewares/passport-middleware')

//init middlewares
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(passport.initialize())

//import routes
const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cloudinaryRoutes = require('./routes/cloudinary')

//use routes
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/cloudinary', cloudinaryRoutes)

//app start function
const appStart = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`)
    })
    //database connection
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

appStart()
