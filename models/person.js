const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to ', url)
mongoose.connect(url).then((response) => {
  console.log('Connected to MongoDB!')
}).catch((err) => {
  console.log('Error connecting to MongoDB! ', err.message)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    validate: {
      validator: (num) => {
        if (num.includes('-')) {
          const splitNumber = num.split('-')
          if (splitNumber.length > 2) {
            return false
          } else {
            if (splitNumber[0].length > 3 || splitNumber[0].length === 1) {
              return false
            }
            if (isNaN(splitNumber[1])) {
              return false
            }
          }
        } else return false
      },
      message: 'Not a valid number! Number Pattern: xxx-xxxxxxxx or xx-xxxxxxxx'
    },
    minLength: 8,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)