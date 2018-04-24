const router = require('koa-router')()
const Students = require('../../models/Schema/studentSchema')
const Departments = require('../../models/Schema/departmentSchema')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const config = require('../../config')

// 路由前缀 prefix
router.prefix(`${config.apiVersion}/students`)

// 获取全部学生列表
router.get('/', async (ctx, next) => {
  const page = parseInt(ctx.query.page)
  const pageSize = parseInt(ctx.query.pageSize)
  const skip = (page - 1) * pageSize
  if (!ctx.query.className && !ctx.query.professional) {
    const total = await Students.find({})
    const count = total.length
    const students = await Students.find({}).skip(skip).limit(pageSize)
    if (students) {
      ctx.rest(200, '数据获取成功', {
        students
      }, {
        count
      })
    } else {
      ctx.throw(404, '数据获取失败')
    }
  } else if (ctx.query.professional === 'undefined') {
    const studentParam = ctx.query
    const total = await Students.find({ className: studentParam.className })
    const count = total.length
    const students = await Students.find({
      className: studentParam.className
    }).skip(skip).limit(pageSize)
    if (students) {
      ctx.rest(200, '数据获取成功', {
        students
      }, {
        count
      })
    } else {
      ctx.throw(404, '数据获取失败')
    }
  } else if (ctx.query.className === 'undefined') {
    const studentParam = ctx.query
    const total = await Students.find({ professional: studentParam.professional })
    const count = total.length
    const students = await Students.find({
      professional: studentParam.professional
    }).skip(skip).limit(pageSize)
    if (students) {
      ctx.rest(200, '数据获取成功', {
        students
      }, {
        count
      })
    } else {
      ctx.throw(404, '数据获取失败')
    }
  } else {
    const studentParam = ctx.query
    const total = await Students.find({
      className: studentParam.className,
      professional: studentParam.professional
    })
    const count = total.length
    const students = await Students.find({
      className: studentParam.className,
      professional: studentParam.professional
    }).skip(skip).limit(pageSize)
    if (students) {
      ctx.rest(200, '数据获取成功', {
        students
      }, {
        count
      })
    } else {
      ctx.throw(404, '数据获取失败')
    }
  }
})

// 学生登录
router.post('/login', async (ctx, next) => {
  const studentParam = {
    studentID: ctx.request.body.studentID,
    password: ctx.request.body.password
  }
  const loginInfo = await Students.findOne({
    studentID: studentParam.studentID
  })
  if (loginInfo) {
    if (await bcrypt.compare(studentParam.password, loginInfo.password)) {
      const studentData = {
        id: loginInfo._id,
        role: loginInfo.role,
        studentName: loginInfo.studentName,
        headImg: loginInfo.headImg,
      }
      const loginSuccess = await Students.updateOne({
        studentID: studentParam.studentID
      }, {
        $set: {
          isLogin: true,
        }
      })
      if (loginSuccess.n) {
        console.log('登录成功')
      } else {
        console.log('登录失败')
      }
      const student = {
        ...studentData,
        token: jsonwebtoken.sign({
          data: {
            ...studentData,
          },
          exp: Math.floor(Date.now() / 10000) + (60 * 60 * 24),
        }, config.secret),
      }
      ctx.rest(200, '登录成功', student)
    } else {
      ctx.throw(404, '登录失败，密码错误')
    }
  } else {
    ctx.throw(404, '登录失败，学号错误')
  }
})

// 学生退出登录
router.put('/logout', async (ctx, next) => {
  const id = ctx.request.body.id
  const editStudent = await Students.update({ _id: id }, {
    $set: {
      isLogin: false,
    }
  })
  if (editStudent.n) {
    console.log('退出成功')
    ctx.rest(201, '退成成功')
  } else {
    console.log('退出失败')
    ctx.throw(400, '退出失败')
  }
})

// 学生注册
router.post('/register', async (ctx, next) => {
  let encryptionPassword = await bcrypt.hash(ctx.request.body.password, 10)
  const studentParam = {
    studentID: ctx.request.body.studentID,
    studentName: ctx.request.body.studentName,
    gender: ctx.request.body.gender,
    className: ctx.request.body.className,
    email: ctx.request.body.email,
    password: encryptionPassword,
    professional: ctx.request.body.professional,
  }
  const studentID = await Students.findOne({ studentID: studentParam.studentID })
  if (!studentID) {
    await next()
  } else {
    ctx.throw(422, '您已注册过！')
  }
  const registerInfo = await Students.insertMany(studentParam)
  if (registerInfo) {
    ctx.rest(201, '注册成功')
  } else {
    ctx.throw(400, '注册失败')
  }
})

// 批量导入学生
router.post('/importStudents', async (ctx, next) => {
  const studentsParams = ctx.request.body
  const classNameList = []
  for (let i = 0; i < studentsParams.length; i += 1) {
    studentsParams[i].password = await bcrypt.hash(studentsParams[i].password, 10)
    classNameList.push(studentsParams[i].className)
    const importSuccess = await Students.insertMany(studentsParams[i])
    if (importSuccess.length) {
      ctx.rest(201, '导入成功')
    } else {
      ctx.throw(400, `导入失败`)
    }
  }

  // 导入学生列表中的班级，去重后添加到数据库
  const departments = await Departments.find({})
  let classes = departments[0].classes
  let className = [...classes, ...classNameList]
  const unique = (arr) => [...new Set(arr)] // 去重函数
  classes = unique(className)
  const addSccuess = await Departments.update({
    _id: departments[0]._id
  }, {
    $set: {
      classes,
    }
  })
  if (addSccuess.n) {
    console.log('班级导入成功')
  } else  {
    console.log('班级导入失败')
  }
})

// 获取单个学生信息
router.get('/:id', async (ctx, next) => {
  const id = ctx.params.id
  const student = await Students.findOne({ studentID: id })
  if (student) {
    ctx.rest(200, '数据获取成功', {
      student
    })
  } else {
    ctx.throw(404, '数据获取失败')
  }
})

// 删除单个学生列表
router.delete('/deleteStudent/:id', async (ctx, next) => {
  const id = ctx.params.id
  const studentDelete = await Students.deleteOne({ studentID: id })
  if (studentDelete.n) {
    ctx.rest(201, '删除成功')
  } else {
    ctx.throw(400, '删除失败')
  }
})

// 批量删除学生
router.delete('/deleteAll', async (ctx, next) => {
  const ids = ctx.query.ids.split(',')
  for (let i = 0; i < ids.length; i+=1) {
    const response = await Students.deleteMany({ studentID: ids[i] })
    if (response.n) {
      ctx.rest(201, '删除成功')
    } else {
      ctx.throw(400, `删除${ids[i]}失败`)
    }
  }
})

// 重置学生密码
router.put('/resetPassword/:id', async (ctx, next) => {
  const id = ctx.params.id
  const studentForm = ctx.request.body
  let encryptionPassword = await bcrypt.hash(ctx.request.body.password, 10)
  studentForm.password = encryptionPassword
  const editStudent = await Students.update({ studentID: id }, {
    $set: studentForm
  })
  if (editStudent.n) {
    ctx.rest(201, '重置成功')
  } else {
    ctx.throw(400, '重置失败')
  }
})

// 修改学生密码
router.put('/password/:id', async (ctx, next) => {
  const id = ctx.params.id
  const studentPasswordForm = ctx.request.body
  console.log(id)
  const student = await Students.findOne({
    _id: id
  })
  console.log(student)
  const passwordRight = await bcrypt.compare(studentPasswordForm.oldPassword, student.password)
  if (passwordRight) {
    let encryptionPassword = await bcrypt.hash(studentPasswordForm.password, 10)
    const changePassword = await Students.update({
      _id: id
    }, {
      $set: {
        password: encryptionPassword,
      }
    })
    if (changePassword.n) {
      ctx.rest(201, '修改成功')
    } else {
      ctx.throw(400, '修改失败')
    }
  } else {
    ctx.rest(404, '旧密码错误')
  }
})

// 修改学生信息
router.put('/info/:id', async (ctx, next) => {
  const id = ctx.params.id
  const studentForm = ctx.request.body
  const editStudent = await Students.update({ studentID: id }, {
    $set: studentForm
  })
  if (editStudent.n) {
    ctx.rest(201, '修改成功')
  } else {
    ctx.throw(400, '修改失败')
  }
})

module.exports = router
