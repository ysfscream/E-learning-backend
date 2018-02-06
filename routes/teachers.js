const router = require('koa-router')()
const Teachers = require('../models/Schema/teacherSchema')

// 路由前缀 prefix
router.prefix('/api/v1/teachers')

router.get('/', async (ctx, next) => {
  const teachers = await Teachers.find({})
  if (teachers) {
    ctx.rest(200, 'find success', {
      teachers
    })
  } else {
    ctx.throw(404, 'find fail')
  }
})

router.post('/login', async (ctx, next) => {
  const teacherParam = {
    email: ctx.request.body.email,
    password: ctx.request.body.password
  }
  const loginInfo = await Teachers.findOne(teacherParam)
  if (loginInfo) {
    const teacher = {
      id: loginInfo._id,
      role: loginInfo.role,
      teacherName: loginInfo.teacherName,
    }
    ctx.rest(200, '登录成功', teacher)
  } else {
    ctx.throw(404, '登录失败，用户名或密码错误')
  }
})

router.post('/register', async (ctx, next) => {
  const teacherParam = {
    email: ctx.request.body.email,
    teacherName: ctx.request.body.teacherName,
    password: ctx.request.body.password,
  }
  const teacherEmail = await Teachers.findOne({ email: teacherParam.email })
  if (!teacherEmail) {
    await next()
  } else {
    ctx.throw(422, 'Email 已经被注册')
  }
  const teacherCount = await Teachers.find()
  teacherParam.teacherID = teacherCount.length + 1
  const registerInfo = await Teachers.insertMany(teacherParam)
  if (registerInfo) {
    ctx.rest(201, '注册成功')
  } else {
    ctx.throw(400, '注册失败')
  }
})

module.exports = router
