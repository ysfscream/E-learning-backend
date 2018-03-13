const students = require('./students')
const teachers = require('./teachers')
const departments = require('./departments')
const materials = require('./materials')
const uploadFile = require('./uploadFile')

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
      router: uploadFile.routes(),
      allowedMethods: uploadFile.allowedMethods()
    }
  ]
}
