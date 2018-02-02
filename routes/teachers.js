const router = require('koa-router')()

// 路由前缀 prefix
router.prefix('/teachers')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a teachers response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a teachers/bar response'
})

module.exports = router
