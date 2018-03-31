const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId
const slideshowSchema = new Schema({
  _id: ObjectId,
  title: { type: String },
  img: { type: String }
})

module.exports = mongoose.model('Slideshows', slideshowSchema)
