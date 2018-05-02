const router = require('koa-router')()
const Teachers = require('../../models/Schema/teacherSchema')
const Students = require('../../models/Schema/studentSchema')
const Departments = require('../../models/Schema/departmentSchema')

const config = require('../../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/statistics`)

// 获取全部学生统计
router.get('/studentsCount', async (ctx, next) => {
  const student = await Students.find({})
  const departments = await Departments.find({})

  const count = student.length
  const isLogin = student.filter((student) => student.isLogin).length
  const isNotLogin = student.filter((student) => !student.isLogin).length

  const professional = departments[0].professional
  const len = professional.length
  const professionalName = []
  const professionalData = []

  for (let i = 0; i < len; i++) {
    professionalName.push(professional[i])
    const professionalValue = await Students.find({ professional: professional[i] })
    if (professionalValue) {
      professionalData.push(professionalValue.length)
    } else {
      ctx.throw(404, '数据获取失败')
    }
  }

  if (student && departments) {
    ctx.rest(200, '数据获取成功', {
      professionalName,
      professionalData,
    }, {
      count,
      isLogin,
      isNotLogin,
    })
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

// 获取全部视频统计
router.get('/videosCount/:id', async (ctx, next) => {
  const id = ctx.params.id
  const teacher = await Teachers.findOne({ _id: id })

  const videos = teacher.videos
  const count = videos.length

  const departments = await Departments.find({})
  const tags = departments[0].tags
  const len = tags.length

  const videosName = []
  const videosData = []

  for (let i = 0; i < len; i++) {
    let videosName = videos.filter((video) => video.tag === tags[i])
    videosData.push({
      value: videosName.length,
      name: tags[i]
    })
  }

  if (teacher && departments) {
    ctx.rest(200, '数据获取成功', {
      videosData
    }, {
      count
    })
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

// 获取全部文档统计
router.get('/docsCount/:id', async (ctx, next) => {
  const id = ctx.params.id
  const teacher = await Teachers.findOne({ _id: id })

  const docs = teacher.docs
  const count = docs.length

  const departments = await Departments.find({})
  const tags = departments[0].tags
  const len = tags.length

  const docsData = []
  const docsName = []

  for (let i = 0; i < len; i++) {
    let docsLen = docs.filter((doc) => doc.tag === tags[i])
    docsData.push(docsLen.length)
    docsName.push(tags[i])
  }

  if (teacher && departments) {
    ctx.rest(200, '数据获取成功', {
      docsData,
      docsName
    }, {
        count
      })
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

module.exports = router
