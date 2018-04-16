const router = require('koa-router')()
const Teachers = require('../../models/Schema/teacherSchema')

const config = require('../../config')

router.prefix(`${config.apiVersion}/platform`)

// 获取最受欢迎
router.get('/getPopular', async (ctx, next) => {
  const teacherList = await Teachers.find({})
  const videoList = []
  const docsList = []
  const PPTList = []
  teacherList.forEach((teacher) => {
    videoList.push(...teacher.videos)
    docsList.push(...teacher.docs)
    PPTList.push(...teacher.coursePPT)
  })
  videoList.sort((perv, next) => {
    return (next.view - perv.view)
  })
  docsList.sort((perv, next) => {
    return (next.view - perv.view)
  })
  const popular = {
    videoList,
    docsList,
    PPTList
  }
  if (popular) {
    ctx.rest(200, '获取成功', { popular })
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 获取最新上传
router.get('/getNew', async (ctx, next) => {
  const teacherList = await Teachers.find({})
  const videoList = []
  const docsList = []
  const PPTList = []
  teacherList.forEach((teacher) => {
    videoList.push(...teacher.videos)
    docsList.push(...teacher.docs)
    PPTList.push(...teacher.coursePPT)
  })
  videoList.sort((perv, next) => {
    return (next.videoId - perv.videoId)
  })
  docsList.sort((perv, next) => {
    return (next.docsId - perv.docsId)
  })
  PPTList.sort((perv, next) => {
    return (next.pptId - perv.pptId)
  })
  const newList = {
    videoList,
    docsList,
    PPTList
  }
  if (newList) {
    ctx.rest(200, '获取成功', { newList })
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 获取点赞最多
router.get('/getLikes', async (ctx, next) => {
  const teacherList = await Teachers.find({})
  const videoList = []
  const docsList = []
  const PPTList = []
  teacherList.forEach((teacher) => {
    videoList.push(...teacher.videos)
    docsList.push(...teacher.docs)
    PPTList.push(...teacher.coursePPT)
  })
  videoList.sort((perv, next) => {
    return (next.likes - perv.likes)
  })
  docsList.sort((perv, next) => {
    return (next.likes - perv.likes)
  })
  PPTList.sort((perv, next) => {
    return (next.likes - perv.likes)
  })
  const likesList = {
    videoList,
    docsList,
    PPTList
  }
  if (likesList) {
    ctx.rest(200, '获取成功', { likesList })
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 获取全部分享
router.get('/getShares', async (ctx, next) => {
  const teacherList = await Teachers.find({})
  const shareList = []
  teacherList.forEach((teacher) => {
    shareList.push(...teacher.share)
  })
  shareList.reverse()
  if (shareList) {
    ctx.rest(200, '获取成功', { shareList })
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 获取标签分类
router.get('/getTags/:tag', async (ctx, next) => {
  const tag = ctx.params.tag
  console.log(tag)
  const teacherList = await Teachers.find({})
  const videoList = []
  const docsList = []
  const PPTList = []
  teacherList.forEach((teacher) => {
    videoList.push(...teacher.videos)
    docsList.push(...teacher.docs)
    PPTList.push(...teacher.coursePPT)
  })
  let videos = videoList.filter((video) => video.tag === tag)
  let docs = docsList.filter((doc) => doc.tag === tag)
  let PPTs = PPTList.filter((PPT) => PPT.tag === tag)
  const tagList = {
    videos,
    docs,
    PPTs,
  }
  if (tagList) {
    ctx.rest(200, '获取成功', { tagList })
  } else {
    ctx.throw(404, '获取失败')
  }
})

module.exports = router
