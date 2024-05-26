const axios = require('axios');
const bcrypt = require('bcrypt')
const tutorsRouter = require('express').Router()
const Tutor = require('../models/tutor')


tutorsRouter.post('/', async (request, response) => {
  const { username, password} = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const savedTutor = await Tutor.create({
    username,
    passwordHash,
    appointments: [],
    schedule: []})

  await axios.post('http://localhost:3000/schedules', {tutor: username, hours: [["Free","Free","Free","Free","Free"],["Free","Free","Free","Free","Free"],["Free","Free","Free","Free","Free"],["Free","Free","Free","Free","Free"],["Free","Free","Free","Free","Free"],["Free","Free","Free","Free","Free"],["Free","Free","Free","Free","Free"],["Free","Free","Free","Free","Free"],["Free","Free","Free","Free","Free"],["Free","Free","Free","Free","Free"]]})

  response.status(201).json(savedTutor)
})

tutorsRouter.get('/', (request, response, next) => {
  Tutor.find({}).then(tutors => {
    response.json(tutors)
  })
})

module.exports = tutorsRouter