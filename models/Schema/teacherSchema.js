const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId
const teacherSchema = new Schema({
  _id: ObjectId,
  role: { type: String, required: true, default: 'teacher' },
  teacherID: { type: Number, required: true },
  teacherName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  description: { type: String, default: ''},
  department: { type: String, default: '' },
  video: { type: Array, default: [] },
  docs: { type: Array, default: [] },
  coursePPT: { type: Array, default: [] },
  share: { type: Array, default: [] },
  createAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Teachers', teacherSchema)
