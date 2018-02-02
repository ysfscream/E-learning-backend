const router = require('koa-router')()
var mongoose = require('mongoose')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: '👏 Hello developer!'
  })
})

module.exports = router
