const router = require('koa-router')()

// 路由前缀 prefix
router.prefix('/students')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a students response!'
})

router.get('/:id', function (ctx, next) {
  ctx.body = 'this is a students/bar response'
})

module.exports = router
