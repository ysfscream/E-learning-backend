const router = require('koa-router')()
const Teachers = require('../models/Schema/teacherSchema')

// 路由前缀 prefix
router.prefix('/api/v1/teachers')

router.get('/', async (ctx, next) => {
  const teachers = await Teachers.find({})
  if (teachers) {
    ctx.rest(200, '查找成功', {
      teachers
    })
  } else {
    ctx.throw(404, '查找失败')
  }
})

module.exports = router
