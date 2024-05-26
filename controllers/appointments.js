const appointmentsRouter = require('express').Router()
const Appointment = require('../models/appointment')
const { google } = require('googleapis')
require('dotenv').config()
const { OAuth2 } = google.auth
const Student = require('../models/student')
const Tutor = require('../models/tutor')

const oAuth2Client = new OAuth2(
  String(process.env.CLIENTID),
  String(process.env.CLIENTSECRET)
)

oAuth2Client.setCredentials({
  refresh_token: String(process.env.REFRESHTOKEN),
})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

  appointmentsRouter.get('/', (request, response) => {
    Appointment.find({}).then(appointments => {
      response.json(appointments)
    })
    
  })
  
  appointmentsRouter.get('/confirmed', (request, response) => {
    Appointment.find({state : "confirmed"} ).then(appointments => {
      response.json(appointments)
    })
  })
  
  appointmentsRouter.get('/unconfirmed', (request, response) => {
    Appointment.find({state : "unconfirmed"}).then(appointments => {
      response.json(appointments)
    })
  })
  
  appointmentsRouter.post('/', async (request, response) => {
    const appointmentinfo = request.body
    
    const student = await Student.findOne({username : appointmentinfo.student}).exec()
    const tutor = await Tutor.findOne({username : appointmentinfo.tutor}).exec()

    const appointment = new Appointment({
      time: appointmentinfo.time,
      day: appointmentinfo.day,
      tutor: appointmentinfo.tutor,
      student: appointmentinfo.student,
      state: "unconfirmed",
      tutorid: tutor.id,
      studentid: student.id
    })
  
    const savedAppointment= await appointment.save()
    student.appointments = student.appointments.concat(savedAppointment._id)
    tutor.appointments = student.appointments.concat(savedAppointment._id)
    await student.save()
    await tutor.save()
    
    
    response.json(savedAppointment)  
  })
  
  appointmentsRouter.put('/', (request, response, next) => {
    const getIndex = (day) => {
      switch (day) {case 'Monday':return 1;case 'Tuesday':return 2;case 'Wednesday':return 3;case 'Thursday':return 4; case 'Friday':return 5;default:return 'undefineddate';}};
  
    const appointmentinfo = request.body
  
    const eventStartTime = new Date()
    console.log(eventStartTime.getDay(), getIndex(appointmentinfo.day))
    eventStartTime.setDate(eventStartTime.getDate() - eventStartTime.getDay())
    console.log(eventStartTime.toDateString())
    eventStartTime.setDate(eventStartTime.getDate() + getIndex(appointmentinfo.day) + 7 )
    console.log(eventStartTime.toDateString())
    eventStartTime.setHours(appointmentinfo.time )
    console.log(eventStartTime.toDateString())
    console.log(eventStartTime)
    eventStartTime.setMinutes(0)

    const eventEndTime = new Date(JSON.parse( JSON.stringify(eventStartTime) ));
    eventEndTime.setHours(eventEndTime.getHours() + 1)
    console.log(eventEndTime)

    const event = {
      summary: `Meeting with ${appointmentinfo.tutor}`,
      description: `Meeting Reminder!`,
      colorId: 1,
      start: {
        dateTime: eventStartTime,
        timeZone: 'Asia/Ho_Chi_Minh',
      },
      end: {
        dateTime: eventEndTime,
        timeZone: 'Asia/Ho_Chi_Minh',
      },
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: 'email',
            minutes: 24 * 60, // 24 hours in minutes
          },
        ],
      },
    }

    calendar.events.insert(
      { calendarId: 'primary', resource: event },
      err => {
        // Check for errors and log them if they exist.
        if (err) return console.error('Error Creating Calender Event:', err)
        // Else log that the event was created.
        return console.log('Calendar event successfully created.')
      })

    const appointment = {
      time: appointmentinfo.time,
      day: appointmentinfo.day,
      tutor: appointmentinfo.tutor,
      student: appointmentinfo.student,
      state: "confirmed",
    }
    console.log(appointment)
    console.log(request.params)
    Appointment.findByIdAndUpdate(appointmentinfo.id, appointment, { new: true })
      .then(updatedAppointment => {
        response.json(updatedAppointment)
      })
      .catch(error => next(error))
  })
  
  module.exports = appointmentsRouter