const schedulesRouter = require('express').Router()
const Schedule = require('../models/schedule')
const Tutor = require('../models/tutor')

schedulesRouter.get('/', (request, response, next) => {
    Schedule.find({}).then(schedules => {
      response.json(schedules)
    })
  })
  
  schedulesRouter.get('/:id', (request, response, next) =>{
    const id = Number(request.params.id)
    Schedule.findbyId(id).then(schedule => {
      if (schedule) {
        response.json(schedule)
      } else {
        response.status(404).end()
      }
    })
  })
  
  schedulesRouter.post('/', async (request, response, next) =>{
    const schedule = request.body
    const tutor = await Tutor.find({username : schedule.tutor}).exec();
    console.log(tutor)
    const tutorInstance = tutor[0];

    const newschedule = new Schedule({
      tutor: schedule.tutor,
      tutorid: tutor.id,
      hours: schedule.hours
    })

    const savedschedule = await newschedule.save()

    tutorInstance.schedules = tutorInstance.schedules.concat(savedschedule._id);
    await tutorInstance.save();

    response.json(newschedule)  
  })
  
  schedulesRouter.put('/', (request, response, next) => {
    const schedule = request.body
  
    const newschedule = {
      tutor: schedule.tutor,
      hours: schedule.hours,
      id: schedule.id
    }
  
    console.log(request.params)
    Schedule.findByIdAndUpdate(schedule.id, newschedule, { new: true })
      .then(updatedSchedule => {
        response.json(updatedSchedule)
      })
      .catch(error => next(error))
  })

  module.exports = schedulesRouter