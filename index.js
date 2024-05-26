const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI || "mongodb://localhost:27017"

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


const appointmentsRouter = require('./controllers/appointments')
const schedulesRouter = require('./controllers/schedules')
const studentsRouter = require('./controllers/students')
const tutorsRouter = require('./controllers/tutors')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())

app.use('/appointments', appointmentsRouter)
app.use('/schedules', schedulesRouter)
app.use('/students', studentsRouter)
app.use('/tutors', tutorsRouter)
app.use('/login', loginRouter)

const PORT = process.env.PORT||3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})