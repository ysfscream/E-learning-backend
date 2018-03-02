const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId
const studentSchema = new Schema({
  _id: ObjectId,
  role: { type: String, default: 'student' },
  studentID: { type: String, required: true },
  studentName: { type: String, required: true },
  gender: { type: String, required: true },
  className: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  professional: { type: String, required: true },
  headImg: { type: String, default: 'http://localhost:3333/public/images/default.png' },
  phone: { type: String, default: '' },
  description: { type: String, default: ''},
  practices: { type: Array, default: [] },
  createAt: { type: Date, default: Date.now() },
  isLogin: { type: Boolean, default: false }
})

module.exports = mongoose.model('Students', studentSchema)
