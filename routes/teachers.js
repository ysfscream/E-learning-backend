const router = require('koa-router')()
const Teachers = require('../models/Schema/teacherSchema')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const config = require('../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/teachers`)

// 获取教师信息
router.get('/', async (ctx, next) => {
  const teachers = await Teachers.find({})
  if (teachers) {
    ctx.rest(200, '数据获取成功', {
      teacher
    })
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

// 教师登录
router.post('/login', async (ctx, next) => {
  const teacherParam = {
    email: ctx.request.body.email,
    password: ctx.request.body.password
  }
  const loginInfo = await Teachers.findOne({
    email: teacherParam.email
  })
  if (loginInfo) {
    if (await bcrypt.compare(teacherParam.password, loginInfo.password)) {
      const teacherData = {
        id: loginInfo._id,
        role: loginInfo.role,
        teacherName: loginInfo.teacherName,
      }
      const teacher = {
        ...teacherData,
        token: jsonwebtoken.sign({
          data: {
            ...teacherData,
          },
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        }, config.secret),
      }
      ctx.rest(200, '登录成功', teacher)
    } else {
      ctx.throw(404, '登录失败，密码错误')
    }
  } else {
    ctx.throw(404, '登录失败，邮箱错误')
  }
})

// 教师注册
router.post('/register', async (ctx, next) => {
  let encryptionPassword = await bcrypt.hash(ctx.request.body.password, 10)
  const teacherParam = {
    email: ctx.request.body.email,
    teacherName: ctx.request.body.teacherName,
    password: encryptionPassword,
  }
  const teacherEmail = await Teachers.findOne({
    email: teacherParam.email
  })
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

// 获取单个教师信息
router.get('/info/:id', async (ctx, next) => {
  const id = ctx.params.id
  const teacher = await Teachers.findOne({
    _id: id
  })
  if (teacher) {
    ctx.rest(200, '数据获取成功', {
      teacherName: teacher.teacherName,
      email: teacher.email,
      phone: teacher.phone,
      address: teacher.address,
      description: teacher.description,
      department: teacher.department,
    })
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

// 修改教师信息
router.put('/info/:id', async (ctx, next) => {
  const id = ctx.params.id
  const teacherForm = ctx.request.body
  const editTeacher = await Teachers.update({
    _id: id
  }, {
    $set: teacherForm
  })
  if (editTeacher.n) {
    ctx.rest(201, '修改成功')
  } else {
    ctx.throw(400, '修改失败')
  }
})

// 修改教师密码
router.put('/password/:id', async (ctx, next) => {
  const id = ctx.params.id
  const teacherPasswordForm = ctx.request.body
  const teacher = await Teachers.findOne({
    _id: id
  })
  const passwordRight = await bcrypt.compare(teacherPasswordForm.oldPassword, teacher.password)
  if (passwordRight) {
    let encryptionPassword = await bcrypt.hash(teacherPasswordForm.password, 10)
    const changePassword = await Teachers.update({
      _id: id
    }, {
      $set: {
        password: encryptionPassword,
      }
    })
    if (changePassword.n) {
      ctx.rest(201, '修改成功')
    } else {
      ctx.throw(400, '修改失败')
    }
  } else {
    ctx.rest(404, '旧密码错误')
  }
})

module.exports = router
