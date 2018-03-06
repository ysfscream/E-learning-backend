const router = require('koa-router')()
const Students = require('../models/Schema/studentSchema')
const bcrypt = require('bcrypt')
// const jsonwebtoken = require('jsonwebtoken')

const config = require('../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/students`)

// 获取全部学生列表
router.get('/', async (ctx, next) => {
  const students = await Students.find({})
  if (students) {
    ctx.rest(200, '数据获取成功', {
      students
    })
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

// 学生注册
router.post('/register', async (ctx, next) => {
  let encryptionPassword = await bcrypt.hash(ctx.request.body.password, 10)
  const studentParam = {
    studentID: ctx.request.body.studentID,
    studentName: ctx.request.body.studentName,
    gender: ctx.request.body.gender,
    className: ctx.request.body.className,
    email: ctx.request.body.email,
    password: encryptionPassword,
    professional: ctx.request.body.professional,
  }
  const studentID = await Students.findOne({ studentID: studentParam.studentID })
  if (!studentID) {
    await next()
  } else {
    ctx.throw(422, '您已注册过！')
  }
  const registerInfo = await Students.insertMany(studentParam)
  if (registerInfo) {
    ctx.rest(201, '注册成功')
  } else {
    ctx.throw(400, '注册失败')
  }
})

// 批量导入学生
router.post('/importStudents', async (ctx, next) => {
  const studentsParams = ctx.request.body
  for (let i = 0; i < studentsParams.length; i += 1) {
    studentsParams[i].password = await bcrypt.hash(studentsParams[i].password, 10)    
    const importSuccess = await Students.insertMany(studentsParams[i])
    if (importSuccess.length) {
      ctx.rest(201, '导入成功')
    } else {
      ctx.throw(400, `导入失败`)
    }
  }
})

// 获取单个学生信息
router.get('/:id', async (ctx, next) => {
  ctx.body = 'this is a students/bar response'
})

// 删除单个学生列表
router.delete('/deleteStudent/:id', async (ctx, next) => {
  const id = ctx.params.id
  const studentDelete = await Students.deleteOne({ studentID: id })
  if (studentDelete.n) {
    ctx.rest(201, '删除成功')
  } else {
    ctx.throw(400, '删除失败')
  }
})

// 批量删除学生
router.delete('/deleteAll', async (ctx, next) => {
  const ids = ctx.query.ids.split(',')
  for (let i = 0; i < ids.length; i+=1) {
    const response = await Students.deleteMany({ studentID: ids[i] })
    if (response.n) {
      ctx.rest(201, '删除成功')
    } else {
      ctx.throw(400, `删除${ids[i]}失败`)
    }
  }
})

module.exports = router
