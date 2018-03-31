const router = require('koa-router')()
const Slideshows = require('../../models/Schema/slideshowSchema')

const config = require('../../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/slideshows`)

router.get('/getSlideshow', async (ctx, next) => {
  const slideshowsList = await Slideshows.find({})
  const slideshows = slideshowsList.reverse().slice(0, 3)
  console.log(slideshows)
  if (slideshows) {
    ctx.rest(200, '查找成功', slideshows)
  } else {
    ctx.throw(404, '查找失败')
  }
})

module.exports = router
