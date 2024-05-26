const bcrypt = require('bcrypt')
const studentsRouter = require('express').Router()
const Student = require('../models/student')

studentsRouter.post('/', async (request, response) => {
  const { username, password} = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const student = new Student({
    username,
    passwordHash,
    appointments: []
  })

  const savedStudent = await student.save()

  response.status(201).json(savedStudent)
})

studentsRouter.get('/', (request, response, next) => {
  Student.find({}).then(students => {
    response.json(students)
  })
})

module.exports = studentsRouter