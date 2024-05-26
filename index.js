const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()


const url = process.env.MONGODB_URI || "mongodb://localhost:27017"

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const Appointment = require('./models/appointment')

app.get('/', (request, response) => {
  response.send('<h1>TutoringProjectDatabase</h1>')
})

app.get('/appointments', (request, response) => {
  Appointment.find({}).then(appointments => {
    response.json(appointments)
  })
  
})

app.get('/appointments/confirmed', (request, response) => {
  Appointment.find({state : "confirmed"} ).then(appointments => {
    response.json(appointments)
  })
})

app.get('/appointments/unconfirmed', (request, response) => {
  Appointment.find({state : "unconfirmed"}).then(appointments => {
    response.json(appointments)
  })
})

app.post('/appointments', (request, response) => {
  const appointmentinfo = request.body

  const appointment = new Appointment({
    time: appointmentinfo.time,
    day: appointmentinfo.day,
    tutor: appointmentinfo.tutor,
    student: appointmentinfo.student,
    state: "unconfirmed"
  })

  appointment.save().then(savedAppointment => {
    response.json(savedAppointment)
  })

})

app.put('/appointments', (request, response, next) => {
  const appointmentinfo = request.body

  const appointment = {
    time: appointmentinfo.time,
    day: appointmentinfo.day,
    tutor: appointmentinfo.tutor,
    student: appointmentinfo.student,
    state: "confirmed",
    id: appointmentinfo.id
  }
  console.log(appointment)
  console.log(request.params)
  Appointment.findByIdAndUpdate(appointmentinfo.id, appointment, { new: true })
    .then(updatedAppointment => {
      response.json(updatedAppointment)
    })
    .catch(error => next(error))
})

app.get('/schedules', (request, response, next) => {
  Schedule.find({}).then(schedules => {
    response.json(schedules)
  })
})

app.get('/schedules/:id', (request, response, next) =>{
  const id = Number(request.params.id)
  Schedule.findbyId(id).then(schedule => {
    if (schedule) {
      response.json(schedule)
    } else {
      response.status(404).end()
    }
  })
})

app.use(cors())
app.use(express.json())

app.use('/appointments', appointmentsRouter)
app.use('/schedules', schedulesRouter)
app.use('/students', studentsRouter)
app.use('/tutors', tutorsRouter)
app.use('/login', loginRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})