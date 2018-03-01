const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require('koa-jwt')
const serve = require('koa-static')

const logs = require('./middlewares/logs')
const rest = require('./middlewares/rest')

const { routers } = require('./routes')

const config = require('./config')
const mongodbConnect = require('./models')

// connect mongodb 连接数据库
mongodbConnect(config.mongo)

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

// jwt验证 路由是否有 token 权限
app.use(jwt({
  secret: config.secret
}).unless({
  path: [/\/login/, /\/register/, /\/public/] // 不需要验证的路由
}))

// 显示静态文件
app.use(serve(__dirname, '/public'))

// routes 路由
routers.map((routerItem) => {
  app.use(routerItem.router, routerItem.allowedMethods)
})

// error-handling 错误处理
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
