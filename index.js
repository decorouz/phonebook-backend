/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/phonebook')
const morgan = require('morgan')

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('data', function (req, _res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : null
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms  :data '
  )
)

app.get('/', (_req, res) => {
  res.send('<h1>Phone Book</h1>')
})

app.get('/api/persons', (_req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons.map((person) => person.toJSON()))
  })
})

app.get('/info', (_req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(`<div>This Phonebook has info for ${persons.length} people.</div>

  
    ${new Date()}`)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedandFormattedPerson) => {
      res.json(savedandFormattedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedEntry) => {
      res.json(updatedEntry.toJSON())
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, _req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res
      .status(400)
      .send({ status: 'error', message: 'malfunctioned id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ status: 'error', message: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
