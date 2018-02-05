const router = require('koa-router')()

// 路由前缀 prefix
router.prefix('api/v1/students')

router.get('/', async (ctx, next) => {
  ctx.body = 'this is a students response!'
})

router.get('/:id', async (ctx, next) => {
  ctx.body = 'this is a students/bar response'
})

module.exports = router
