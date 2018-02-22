const router = require('koa-router')()
const Teachers = require('../models/Schema/teacherSchema')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const config = require('../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/teachers`)

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
  const loginInfo = await Teachers.findOne({email: teacherParam.email})
  if (loginInfo) {
    if (await bcrypt.compare(teacherParam.password, loginInfo.password)) {
      const teacher = {
        id: loginInfo._id,
        role: loginInfo.role,
        teacherName: loginInfo.teacherName,
        token: jsonwebtoken.sign({
          data: {
            id: loginInfo.teacherID,            
            teacherName: loginInfo.teacherName,            
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

router.post('/register', async (ctx, next) => {
  let encryptionPassword = await bcrypt.hash(ctx.request.body.password, 10)
  const teacherParam = {
    email: ctx.request.body.email,
    teacherName: ctx.request.body.teacherName,
    password: encryptionPassword,
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
