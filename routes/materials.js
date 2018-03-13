const router = require('koa-router')()
const Teachers = require('../models/Schema/teacherSchema')

const config = require('../config')

router.prefix(`${config.apiVersion}/meterials`)

//获取分享
router.get('/getShare/:id', async (ctx, next) => {
  const id = ctx.params.id
  const teacher = await Teachers.findOne({ _id: id })
  if (teacher) {
    ctx.rest(200, '获取成功', teacher.share)
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
  if (teacher.share.length === 0) {
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

router.get('/getVideos/:id', async (ctx, next) => {
  const id = ctx.params.id
  const teacher = await Teachers.findOne({ _id: id })
  if (teacher) {
    ctx.rest(200, '获取成功', teacher.videos)
  } else {
    ctx.throw(404, '获取失败')
  }
})

module.exports = router
