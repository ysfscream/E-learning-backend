const students = require('./students')
const teachers = require('./teachers')
const departments = require('./departments')

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
    }
  ]
}
