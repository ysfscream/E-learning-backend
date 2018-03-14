const students = require('./students')
const teachers = require('./teachers')
const departments = require('./departments')
const materials = require('./materials')
const uploadImage = require('./uploadImage')
const uploadVideo = require('./uploadVideo')

module.exports = {
  routers: [
    {
      router: students.routes(),
      allowedMethods: students.allowedMethods()
    },
    {
      router: teachers.routes(),
      allowedMethods: teachers.allowedMethods()
    },
    {
      router: departments.routes(),
      allowedMethods: departments.allowedMethods()
    },
    {
      router: materials.routes(),
      allowedMethods: materials.allowedMethods()
    },
    {
      router: uploadImage.routes(),
      allowedMethods: uploadImage.allowedMethods()
    },
    {
      router: uploadVideo.routes(),
      allowedMethods: uploadVideo.allowedMethods()
    }
  ]
}
