const path = require('path')

const config = {
  mongo: {
    user: 'yushifan',
    password: 'ysf1995522',
    host: '127.0.0.1',
    database: 'E-learning',
    authdb: 'admin',
    port: 27017,
  },
  upload: {
    path: path.join(__dirname, 'public')
  }
}

module.exports = config
