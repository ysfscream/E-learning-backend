const router = require('koa-router')()
const Teachers = require('../../models/Schema/teacherSchema')

const config = require('../../config')

router.prefix(`${config.apiVersion}/students`)

// 获取文档
router.get('/getDocs/:id', async (ctx, next) => {
  const teacherName = ctx.query.teacherName
  const id = parseInt(ctx.params.id)
  const teacher = await Teachers.findOne({ teacherName: teacherName })
  if (teacher) {
    const docsList = teacher.docs
    let restDocs = []
    let currentDoc = {}
    docsList.forEach((doc) => {
      if (doc.docsId === id) {
        currentDoc = doc
        doc.view += 1
      } else {
        restDocs.push(doc)
      }
    })
   ctx.rest(200, '数据获取成功', {
      currentDoc,
      restDocs,
    })
    const updateSuccess = await Teachers.updateOne({
      teacherName: teacherName
    }, {
      $set: {
        docs: docsList,
      }
    })
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

// 获取视频
router.get('/getVideos/:id', async (ctx, next) => {
  const teacherName = ctx.query.teacherName
  const id = parseInt(ctx.params.id)
  const teacher = await Teachers.findOne({ teacherName: teacherName })
  if (teacher) {
    const videosList = teacher.videos
    let restVideos = []
    let currentVideo = {}
    videosList.forEach((video) => {
      if (video.videoId === id) {
        currentVideo = video
        video.view += 1
      } else {
        restVideos.push(video)
      }
    })
    ctx.rest(200, '数据获取成功', {
      currentVideo,
      restVideos,
    })
    const updateSuccess = await Teachers.updateOne({
      teacherName: teacherName
    }, {
      $set: {
        videos: videosList,
      }
    })
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

// 点赞视频
router.put('/likesVideo/:id', async (ctx, next) => {
  const teacherName = ctx.query.teacherName
  const id = parseInt(ctx.params.id)
  const teacher = await Teachers.findOne({ teacherName: teacherName })
  if (teacher) {
    const videosList = teacher.videos
    videosList.forEach((video) => {
      if (video.videoId === id) {
        video.likes += 1
      }
    })
    const updateSuccess = await Teachers.updateOne({
      teacherName: teacherName
    }, {
      $set: {
        videos: videosList,
      }
    })
    if (updateSuccess.n) {
      ctx.rest(201, '喜欢成功', {})
    } else {
      ctx.throw(400, '喜欢失败')
    }
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

// 点赞文档
router.put('/likesDoc/:id', async (ctx, next) => {
  const teacherName = ctx.query.teacherName
  const id = parseInt(ctx.params.id)
  const teacher = await Teachers.findOne({ teacherName: teacherName })
  if (teacher) {
    const docsList = teacher.docs
    docsList.forEach((doc) => {
      if (doc.docsId === id) {
        doc.likes += 1
      }
    })
    const updateSuccess = await Teachers.updateOne({
      teacherName: teacherName
    }, {
      $set: {
        docs: docsList,
      }
    })
    if (updateSuccess.n) {
      ctx.rest(201, '喜欢成功', {})
    } else {
      ctx.throw(400, '喜欢失败')
    }
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

module.exports = router
