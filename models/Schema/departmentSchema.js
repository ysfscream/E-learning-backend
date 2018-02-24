const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId
const departmentSchema = new Schema({
  _id: ObjectId,
  departments: { type: Array, required: true }
})

module.exports = mongoose.model('Departments', departmentSchema)
