const express = require("express")
const app = express()
const morgan = require("morgan")
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(morgan('tiny'))
const PORT = 3001

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  },
  {
    "id": 5,
    "name": "Can Doe",
    "number": "90-535-8356562"
  }
]

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/info", (req, res) => {
  const date = new Date().toString()
  res.send(`<p>Phonebook has info for ${persons.length} people</p>${date}<p></p>`)
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((el) => el.id === id)

  if (person) {
    res.json(person)
  }
  else res.status(404).end()
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((el) => el.id !== id)
  res.status(204).end()
})

const generateNewId = () => {
  return Math.floor(Math.random() * (9999999) + 20)
}
app.post("/api/persons", (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content-missing"
    })
  }
  else if (persons.some((el) => el.name === body.name)) {
    return res.status(400).json({
      error: "duplicate-entry"
    })
  }
  const newPerson = {
    id: generateNewId(),
    name: body.name,
    number: body.number
  }
  persons.push(newPerson)
  console.log(newPerson)
  res.json(newPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})