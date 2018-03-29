const router = require('koa-router')()
const Departments = require('../models/Schema/departmentSchema')

const config = require('../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/departments`)

// 获取系别
router.get('/departments', async (ctx, next) => {
  const departments = await Departments.find({})
  if (departments) {
    ctx.rest(200, '查找成功', departments[0].departments)
  } else {
    ctx.throw(404, '查找失败')
  }
})

// 添加系别
router.put('/departments', async (ctx, next) => {
  const departmentsParam = ctx.request.body
  const data = departmentsParam.departmentTitle
  const departmentsList = await Departments.find({})
  const departments = departmentsList[0].departments
  departments.forEach((depart) => {
    if (depart === data) {
      ctx.throw(404, '系别重复')
    }
  })
  departments.push(data)
  const addSccuess = await Departments.update({
    _id: departmentsList[0]._id
  }, {
    $set: {
      departments,
    }
  })
  if(addSccuess.n) {
    ctx.rest(201, '创建成功')
  } else {
    ctx.throw(404, '创建失败')
  }
})

// 删除系别
router.delete('/departments', async (ctx, next) => {
  const departmentsParam = ctx.query
  const data = departmentsParam.departmentTitle
  const departmentsList = await Departments.find({})
  const departments = departmentsList[0].departments
  const departmentsFilter = departments.filter((depart) => depart !== data)
  const deleteSccuess = await Departments.update({
    _id: departmentsList[0]._id
  }, {
    $set: {
      departments: departmentsFilter
    }
  })
  if(deleteSccuess.n) {
    ctx.rest(201, '删除成功')
  } else {
    ctx.throw(404, '删除失败')
  }
})

// 获取专业
router.get('/professions', async (ctx, next) => {
  const departments = await Departments.find({})
  if (departments) {
    ctx.rest(200, '查找成功', departments[0].professional)
  } else {
    ctx.throw(404, '查找失败')
  }
})

// 添加专业
router.put('/professions', async (ctx, next) => {
  const professionsParam = ctx.request.body
  const data = professionsParam.professionTitle
  const DepartmentsList = await Departments.find({})
  const professions = DepartmentsList[0].professional
  professions.forEach((prof) => {
    if (prof === data) {
      ctx.throw(404, '专业重复')
    }
  })
  professions.push(data)
  console.log(professions)
  const addSccuess = await Departments.update({
    _id: DepartmentsList[0]._id
  }, {
    $set: {
      professional: professions,
    }
  })
  if(addSccuess.n) {
    ctx.rest(201, '创建成功')
  } else {
    ctx.throw(404, '创建失败')
  }
})

// 删除专业
router.delete('/professions', async (ctx, next) => {
  const professionsParam = ctx.query
  const data = professionsParam.professionTitle
  const departmentsList = await Departments.find({})
  const professions = departmentsList[0].professional
  const professionsFilter = professions.filter((prof) => prof !== data)
  const deleteSccuess = await Departments.update({
    _id: departmentsList[0]._id
  }, {
    $set: {
      professional: professionsFilter
    }
  })
  if(deleteSccuess.n) {
    ctx.rest(201, '删除成功')
  } else {
    ctx.throw(404, '删除失败')
  }
})

// 获取班级
router.get('/classes', async (ctx, next) => {
  const departments = await Departments.find({})
  if (departments) {
    ctx.rest(200, '查找成功', departments[0].classes)
  } else {
    ctx.throw(404, '查找失败')
  }
})

// 获取标签
router.get('/tags', async (ctx, next) => {
  const departments = await Departments.find({})
  if (departments) {
    ctx.rest(200, '查找成功', departments[0].tags)
  } else {
    ctx.throw(404, '查找失败')
  }
})

module.exports = router
