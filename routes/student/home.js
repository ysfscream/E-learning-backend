const router = require('koa-router')()
const Slideshows = require('../../models/Schema/slideshowSchema')
const Teachers = require('../../models/Schema/teacherSchema')

const config = require('../../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/home`)

// 获取轮播图
router.get('/getSlideshow', async (ctx, next) => {
  const slideshowsList = await Slideshows.find({})
  const slideshows = slideshowsList.reverse().slice(0, 3)
  if (slideshows) {
    ctx.rest(200, '查找成功', slideshows)
  } else {
    ctx.throw(404, '查找失败')
  }
})

// 获取推荐
router.get('/getRecommend', async (ctx, next) => {
  const teacherList = await Teachers.find({})
  const videoList = []
  const docsList = []
  const PPTList = []
  const shareList = []
  teacherList.forEach((teacher) => {
    videoList.push(...teacher.videos)
    docsList.push(...teacher.docs)
    PPTList.push(...teacher.coursePPT)
    shareList.push(...teacher.share)
  })
  const recommend = {
    videos: videoList.reverse().slice(0, 3),
    docs: docsList.reverse().slice(0, 3),
    PPTs: PPTList.reverse().slice(0, 3),
    shares: shareList.reverse().slice(0, 5),
  }
  if (recommend) {
    ctx.rest(200, '获取成功', { recommend })
  } else {
    ctx.throw(404, '获取失败')
  }
})

module.exports = router
