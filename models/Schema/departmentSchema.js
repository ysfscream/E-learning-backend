const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId
const departmentSchema = new Schema({
  _id: ObjectId,
  departments: { type: Array },
  professional: { type: Array },
  classes: { type: Array }
})

module.exports = mongoose.model('Departments', departmentSchema)
