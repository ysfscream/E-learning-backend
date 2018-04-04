const router = require('koa-router')()
const Teachers = require('../../models/Schema/teacherSchema')

const config = require('../../config')

router.prefix(`${config.apiVersion}/students`)

// 获取文档
router.get('/getDocs/:id', async (ctx, next) => {
  const teacherName = ctx.query.teacherName
  const id = ctx.params.id
  const teacher = await Teachers.findOne({ teacherName: teacherName })
  console.log(teacher)
})

module.exports = router
