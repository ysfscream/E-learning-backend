const router = require('koa-router')()
const Departments = require('../models/Schema/departmentSchema')

const config = require('../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/departments`)

router.get('/departments', async (ctx, next) => {
  const departments = await Departments.find({})
  if (departments) {
    ctx.rest(200, '查找成功', departments[0].departments)
  } else {
    ctx.throw(404, '查找失败')
  }
})

router.get('/professional', async (ctx, next) => {
  const departments = await Departments.find({})
  if (departments) {
    ctx.rest(200, '查找成功', departments[0].professional)
  } else {
    ctx.throw(404, '查找失败')
  }
})

router.get('/classes', async (ctx, next) => {
  const departments = await Departments.find({})
  if (departments) {
    ctx.rest(200, '查找成功', departments[0].classes)
  } else {
    ctx.throw(404, '查找失败')
  }
})

router.get('/tags', async (ctx, next) => {
  const departments = await Departments.find({})
  if (departments) {
    ctx.rest(200, '查找成功', departments[0].tags)
  } else {
    ctx.throw(404, '查找失败')
  }
})

module.exports = router
