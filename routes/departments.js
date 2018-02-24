const router = require('koa-router')()
const Departments = require('../models/Schema/departmentSchema')

const config = require('../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/departments`)

router.get('/', async (ctx, next) => {
  const departments = await Departments.find({})
  console.log()
  if (departments) {
    ctx.rest(200, 'find success', departments[0].departments)
  } else {
    ctx.throw(404, 'find fail')
  }
})

module.exports = router
