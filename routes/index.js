const students = require('./admin/students')
const teachers = require('./admin/teachers')
const departments = require('./admin/departments')
const materials = require('./admin/materials')
const statistics = require('./admin/statistics')
const uploadImage = require('./admin/uploadImage')
const uploadVideo = require('./admin/uploadVideo')
const uploadDocs = require('./admin/uploadDocs')
const uploadPPT = require('./admin/uploadPPT')
const home = require('./student/home')

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
    },
    {
      router: uploadDocs.routes(),
      allowedMethods: uploadDocs.allowedMethods()
    },
    {
      router: uploadPPT.routes(),
      allowedMethods: uploadPPT.allowedMethods()
    },
    {
      router: statistics.routes(),
      allowedMethods: statistics.allowedMethods()
    },
    {
      router: home.routes(),
      allowedMethods: home.allowedMethods()
    }
  ]
}
