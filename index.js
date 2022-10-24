require('dotenv').config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require('cors')
const Person = require('./models/person')
//app.use(cors())

app.use(express.json())
app.use(express.static('build'))

morgan.token('info', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))


app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get("/info", (req, res) => {
  const date = new Date().toString()
  res.send(`<p>Phonebook has info for ${persons.length} people</p>${date}<p></p>`)
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  }).catch((err) => next(err))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(response => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.post("/api/persons", (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content-missing"
    })
  }
  Person.find({ name: body.name }).then(person => {
    if (person.some(el => el.name === body.name)) {
      return res.status(409).json({
        error: "duplicate-entry"
      })
    }
    else {
      const newPerson = new Person({
        name: body.name,
        number: body.number
      })
      newPerson.save().then((savedPerson) => {
        res.json(savedPerson)
      }).catch((err) => res.json(err.message))
    }
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
app.use(errHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})