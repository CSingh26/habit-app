require('dotenv').config()
const express = require('express')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const socialRoutes = require('./routes/socialAuth')

const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
require('./config/google')

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/social', socialRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
