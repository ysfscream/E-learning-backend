const router = require('koa-router')()
const Teachers = require('../models/Schema/teacherSchema')

const config = require('../config')

router.prefix(`${config.apiVersion}/upload`)

//获取分享
router.post('/', async (ctx, next) => {
  ctx.rest(200, '获取成功')
})

module.exports = router