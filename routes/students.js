const router = require('koa-router')()
const Students = require('../models/Schema/studentSchema')
// const bcrypt = require('bcrypt')
// const jsonwebtoken = require('jsonwebtoken')

const config = require('../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/students`)

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

router.get('/:id', async (ctx, next) => {
  ctx.body = 'this is a students/bar response'
})

module.exports = router
