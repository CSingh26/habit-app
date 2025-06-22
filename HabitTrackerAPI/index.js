require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
