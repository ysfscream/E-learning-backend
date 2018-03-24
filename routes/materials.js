const router = require('koa-router')()
const Teachers = require('../models/Schema/teacherSchema')
const pageNation = require('../middlewares/pagenation.js')

const config = require('../config')

router.prefix(`${config.apiVersion}/meterials`)

//获取分享
router.get('/getShare/:id', async (ctx, next) => {
  const id = ctx.params.id
  const teacher = await Teachers.findOne({ _id: id })
  if (teacher) {
    ctx.rest(200, '获取成功', teacher.share.reverse())
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 添加分享
router.put('/createShare/:id', async (ctx, next) => {
  const id = ctx.params.id
  const shareList = []
  const shareParams = ctx.request.body
  const teacher = await Teachers.findOne({ _id: id })
  if (!teacher.share.length) {
    const shareId = 1
    shareList.push({
      shareId,
      ...shareParams,
    })
    const shareSuccess = await Teachers.update({ _id: id }, {
      $set: {
        share: shareList,
      }
    })
    if (shareSuccess.n) {
      ctx.rest(201, '创建成功')
    } else {
      ctx.throw(400, '创建失败')
    }
  } else {
    const shareId = teacher.share[teacher.share.length - 1].shareId + 1
    teacher.share.map((share) => {
      if (share.shareLink === shareParams.shareLink) {
        ctx.throw(422, '重复分享')
      }
    })
    teacher.share.push({
      shareId,
      ...shareParams,
    })
    const shareSuccess = await Teachers.update({ _id: id }, {
      $set: {
        share: teacher.share,
      }
    })
    if (shareSuccess.n) {
      ctx.rest(201, '创建成功')
    } else {
      ctx.throw(400, '创建失败')
    }
  }
})

// 更新分享
router.put('/updateShare/:id', async (ctx, next) => {
  const id = ctx.params.id
  const shareParams = ctx.request.body
  const teacher = await Teachers.findOne({ _id: id })
  if (teacher) {
    const shareSuccess = await Teachers.update({ _id: id }, {
      $set: {
        share: shareParams,
      }
    })
    if (shareSuccess.n) {
      ctx.rest(201, '修改成功')
    } else {
      ctx.throw(400, '修改失败')
    }
  }
})

// 删除分享
router.delete('/deleteShare/:id', async (ctx, next) => {
  const id = ctx.params.id
  const shareId = parseInt(ctx.query.shareId)
  const teacher = await Teachers.findOne({ _id: id })
  if (teacher) {
    const currentShare = teacher.share.filter(item => item.shareId === shareId)
    if (currentShare.length) {
      const deleteShare = await Teachers.update({ _id: id }, {
        $pullAll: {
          share: currentShare
        }
      })
      if (deleteShare.n) {
        ctx.rest(201, '删除成功')
      } else {
        ctx.throw(400, '删除失败')
      }
    }
  }
})

// 获取视频
router.get('/getVideos/:id', async (ctx, next) => {
  const page = parseInt(ctx.query.page)
  const pageSize = parseInt(ctx.query.pageSize)

  const id = ctx.params.id
  const teacher = await Teachers.findOne({ _id: id })
  const videosList = teacher.videos.reverse()
  const count = videosList.length
  const videos = pageNation(page, pageSize, videosList)

  if (videos) {
    ctx.rest(200, '获取成功', videos, {
      count
    })
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 添加视频
router.put('/uploadVideo/:id', async (ctx, next) => {
  const id = ctx.params.id
  const videoList = []
  const videoParams = ctx.request.body
  const host = ctx.request.host

  // 修改视频地址
  videoParams.video = `http://${host}/public/uploads/video/${videoParams.video}`

  const teacher = await Teachers.findOne({ _id: id })
  if (!teacher.videos.length) {
    const videoId = 1
    videoList.push({
      videoId,
      ...videoParams,
    })
    const uploadSuccess = await Teachers.update({ _id: id }, {
      $set: {
        videos: videoList,
      }
    })
    if (uploadSuccess.n) {
      ctx.rest(201, '上传成功')
    } else {
      ctx.throw(400, '上传失败')
    }
  } else {
    const videoId = teacher.videos[teacher.videos.length - 1].videoId + 1
    teacher.videos.map((video) => {
      if (video.title === videoParams.title) {
        ctx.throw(422, '视频名称重复')
      }
    })
    teacher.videos.push({
      videoId,
      ...videoParams,
    })
    const uploadSuccess = await Teachers.update({ _id: id }, {
      $set: {
        videos: teacher.videos,
      }
    })
    if (uploadSuccess.n) {
      ctx.rest(201, '上传成功')
    } else {
      ctx.throw(400, '上传失败')
    }
  }
})

// 分类搜索
router.get('/searchVideo/:id', async (ctx, next) => {
  const id = ctx.params.id
  const tag = ctx.query.tag
  const teacher = await Teachers.findOne({ _id: id })
  const videosList = teacher.videos.reverse()
  if (videosList) {
    const videos = videosList.filter((video) => video.tag === tag)
    if (videos) {
      ctx.rest(200, '获取成功', videos)
    }
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 删除视频
router.delete('/deleteVideo/:id', async (ctx, next) => {
  const id = ctx.params.id
  const videoId = parseInt(ctx.query.videoId)
  const teacher = await Teachers.findOne({ _id: id })
  if (teacher) {
    const currentVideo = teacher.videos.filter(item => item.videoId === videoId)
    if (currentVideo.length) {
      const deleteVideo = await Teachers.update({ _id: id }, {
        $pullAll: {
          videos: currentVideo
        }
      })
      if (deleteVideo.n) {
        ctx.rest(201, '删除成功')
      } else {
        ctx.throw(400, '删除失败')
      }
    }
  }
})

// 获取文档
router.get('/getDocs/:id', async (ctx, next) => {
  const page = parseInt(ctx.query.page)
  const pageSize = parseInt(ctx.query.pageSize)

  const id = ctx.params.id
  const teacher = await Teachers.findOne({ _id: id })
  const docsList = teacher.docs.reverse()
  const count = docsList.length
  const docs = pageNation(page, pageSize, docsList)

  if (docs) {
    ctx.rest(200, '获取成功', docs, {
      count
    })
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 获取文档详情
router.get('/getDocsInfo/:id', async (ctx, next) => {
  const id = ctx.params.id
  const docsId = parseInt(ctx.query.docsId)
  const teacher = await Teachers.findOne({ _id: id })

  const docsList = teacher.docs
  const doc = docsList.filter((doc) => doc.docsId === docsId)[0]

  if (teacher && docsList) {
    ctx.rest(200, '获取成功', {
      ...doc
    })
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 更新文档
router.put('/updateDocs/:id', async (ctx, next) => {
  const id = ctx.params.id
  const docsParams = ctx.request.body
  const docsId = docsParams.docsId

  const teacher = await Teachers.findOne({ _id: id })

  if (teacher) {
    const docsList = teacher.docs
    const docs = docsList.map((doc) => {
      if (doc.docsId === docsId) {
        Object.assign(doc, docsParams)
      }
      return doc
    })
    const docsSuccess = await Teachers.update({ _id: id }, {
      $set: {
        docs: docs,
      }
    })
    if (docsSuccess.n) {
      ctx.rest(201, '更新成功')
    } else {
      ctx.throw(404, '更新失败')
    }
  } else {
    ctx.throw(404, '更新失败')
  }
})

// 添加文档
router.put('/uploadDocs/:id', async (ctx, next) => {
  const id = ctx.params.id
  const docsList = []
  const docsParams = ctx.request.body
  const host = ctx.request.host

  // 修改视频地址
  docsParams.doc = `http://${host}/public/uploads/docs/${docsParams.doc}`

  const teacher = await Teachers.findOne({ _id: id })
  if (!teacher.docs.length) {
    const docsId = 1
    docsList.push({
      docsId,
      ...docsParams,
    })
    const uploadSuccess = await Teachers.update({ _id: id }, {
      $set: {
        docs: docsList,
      }
    })
    if (uploadSuccess.n) {
      ctx.rest(201, '上传成功')
    } else {
      ctx.throw(400, '上传失败')
    }
  } else {
    const docsId = teacher.docs[teacher.docs.length - 1].docsId + 1
    teacher.docs.map((video) => {
      if (video.title === docsParams.title) {
        ctx.throw(422, '文档名称重复')
      }
    })
    teacher.docs.push({
      docsId,
      ...docsParams,
    })
    const uploadSuccess = await Teachers.update({ _id: id }, {
      $set: {
        docs: teacher.docs,
      }
    })
    if (uploadSuccess.n) {
      ctx.rest(201, '上传成功')
    } else {
      ctx.throw(400, '上传失败')
    }
  }
})

// 删除文档
router.delete('/deleteDocs/:id', async (ctx, next) => {
  const id = ctx.params.id
  const docsId = parseInt(ctx.query.docsId)
  const teacher = await Teachers.findOne({ _id: id })
  if (teacher) {
    const currentDocs = teacher.docs.filter(item => item.docsId === docsId)
    if (currentDocs.length) {
      const deleteDocs = await Teachers.update({ _id: id }, {
        $pullAll: {
          docs: currentDocs
        }
      })
      if (deleteDocs.n) {
        ctx.rest(201, '删除成功')
      } else {
        ctx.throw(400, '删除失败')
      }
    }
  }
})

// 分类搜索文档
router.get('/searchDocs/:id', async (ctx, next) => {
  const id = ctx.params.id
  const page = parseInt(ctx.query.page)
  const pageSize = parseInt(ctx.query.pageSize)
  const tag = ctx.query.tag
  const teacher = await Teachers.findOne({ _id: id })
  const docsList = teacher.docs.reverse()
  if (docsList) {
    const docs = docsList.filter((doc) => {
      return doc.tag === tag
    })
    const count = docs.length
    if (docs) {
      ctx.rest(200, '获取成功', docs, {
        count
      })
    }
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 获取ppt
router.get('/getPPT/:id', async (ctx, next) => {
  const page = parseInt(ctx.query.page)
  const pageSize = parseInt(ctx.query.pageSize)

  const id = ctx.params.id
  const teacher = await Teachers.findOne({ _id: id })
  const PPTList = teacher.coursePPT
  const count = PPTList.length
  const PPTs = pageNation(page, pageSize, PPTList)

  if (PPTs) {
    ctx.rest(200, '获取成功', PPTs, {
      count
    })
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 添加ppt
router.put('/uploadPPT/:id', async (ctx, next) => {
  const id = ctx.params.id
  const PPTList = []
  const PPTParams = ctx.request.body
  const host = ctx.request.host

  // 修改ppt地址
  PPTParams.ppt = `http://${host}/public/uploads/ppt/${PPTParams.ppt}`

  const teacher = await Teachers.findOne({ _id: id })
  if (!teacher.coursePPT.length) {
    const pptId = 1
    PPTList.push({
      pptId,
      ...PPTParams,
    })
    const uploadSuccess = await Teachers.update({ _id: id }, {
      $set: {
        coursePPT: PPTList,
      }
    })
    if (uploadSuccess.n) {
      ctx.rest(201, '上传成功')
    } else {
      ctx.throw(400, '上传失败')
    }
  } else {
    const pptId = teacher.coursePPT[teacher.coursePPT.length - 1].pptId + 1
    teacher.coursePPT.map((ppt) => {
      if (ppt.title === PPTParams.title) {
        ctx.throw(422, '课件名称重复')
      }
    })
    teacher.coursePPT.push({
      pptId,
      ...PPTParams,
    })
    const uploadSuccess = await Teachers.update({ _id: id }, {
      $set: {
        coursePPT: teacher.coursePPT,
      }
    })
    if (uploadSuccess.n) {
      ctx.rest(201, '上传成功')
    } else {
      ctx.throw(400, '上传失败')
    }
  }
})

// 删除ppt
router.delete('/deletePPT/:id', async (ctx, next) => {
  const id = ctx.params.id
  const pptId = parseInt(ctx.query.pptId)
  const teacher = await Teachers.findOne({ _id: id })
  if (teacher) {
    const currentPPTs = teacher.coursePPT.filter(item => item.pptId === pptId)
    if (currentPPTs.length) {
      const deletePPTs = await Teachers.update({ _id: id }, {
        $pullAll: {
          coursePPT: currentPPTs
        }
      })
      if (deletePPTs.n) {
        ctx.rest(201, '删除成功')
      } else {
        ctx.throw(400, '删除失败')
      }
    }
  }
})

// 获取ppt详情
router.get('/getPPTInfo/:id', async (ctx, next) => {
  const id = ctx.params.id
  const pptId = parseInt(ctx.query.pptId)
  const teacher = await Teachers.findOne({ _id: id })

  const PPTList = teacher.coursePPT
  const ppt = PPTList.filter((ppt) => ppt.pptId === pptId)[0]

  if (teacher && PPTList) {
    ctx.rest(200, '获取成功', {
      ...ppt
    })
  } else {
    ctx.throw(404, '获取失败')
  }
})

// 更新ppt
router.put('/updatePPT/:id', async (ctx, next) => {
  const id = ctx.params.id
  const PPTParams = ctx.request.body
  const pptId = PPTParams.pptId

  const teacher = await Teachers.findOne({ _id: id })

  if (teacher) {
    const PPTList = teacher.coursePPT
    const ppts = PPTList.map((ppt) => {
      if (ppt.pptId === pptId) {
        Object.assign(ppt, PPTParams)
      }
      return ppt
    })
    const pptsSuccess = await Teachers.update({ _id: id }, {
      $set: {
        coursePPT: ppts,
      }
    })
    if (pptsSuccess.n) {
      ctx.rest(201, '更新成功')
    } else {
      ctx.throw(404, '更新失败')
    }
  } else {
    ctx.throw(404, '更新失败')
  }
})

// 分类搜索ppt
router.get('/searchPPT/:id', async (ctx, next) => {
  const id = ctx.params.id
  const page = parseInt(ctx.query.page)
  const pageSize = parseInt(ctx.query.pageSize)
  const tag = ctx.query.tag
  const teacher = await Teachers.findOne({ _id: id })
  const PPTList = teacher.coursePPT.reverse()
  if (PPTList) {
    const ppts = PPTList.filter((ppt) => {
      return ppt.tag === tag
    })
    const count = ppts.length
    if (ppts) {
      ctx.rest(200, '获取成功', ppts, {
        count
      })
    }
  } else {
    ctx.throw(404, '获取失败')
  }
})

module.exports = router
