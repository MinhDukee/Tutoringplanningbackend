const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const Student = require('../models/student')
const Tutor = require('../models/tutor')

loginRouter.post('/', async (request, response) => {
  const { username, password, role } = request.body

  let user

  if (role == "student"){
     user = await Student.findOne({ username })
  } else {
     user = await Tutor.findOne({ username })
  }
  console.log(user)
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, status: role })
})

module.exports = loginRouter