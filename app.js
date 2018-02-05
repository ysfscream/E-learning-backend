const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const logs = require('./middlewares/logs')
const rest = require('./middlewares/rest')

const index = require('./routes/index')
const students = require('./routes/students')
const teachers = require('./routes/teachers')

const mongodbConnect = require('./models')

// connect mongodb 连接数据库
mongodbConnect()

// error handler  app错误处理
onerror(app)

// middlewares 中间件
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 格式化处理返回的 restAPI 返回的 JSON
app.use(rest.restify())

// logger 日志
app.use(logs())

// routes 路由
app.use(index.routes(), index.allowedMethods())
app.use(students.routes(), students.allowedMethods())
app.use(teachers.routes(), teachers.allowedMethods())

// error-handling 错误处理
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
