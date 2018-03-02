const path = require('path')

const config = {
  // 数据库的配置
  mongo: {
    user: 'yushifan',
    password: 'ysf1995522',
    host: '127.0.0.1',
    database: 'E-learning',
    authdb: 'admin',
    port: 27017
  },
  // jwt 验证的 secret
  secret: 'e-learning-admin-secret',
  // REST 路由前缀
  apiVersion: '/api/v1',
  // 上传文件
  upload: {
    path: path.join(__dirname, 'public')
  }
}

module.exports = config
