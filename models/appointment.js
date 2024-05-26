const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  time: Number,
  day: String,
  tutor: String,
  student: String,
  state: String,
  // 
})

appointmentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Appointment', appointmentSchema)