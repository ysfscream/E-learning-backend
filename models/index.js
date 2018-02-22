const mongoose = require('mongoose')
const schema = mongoose.Schema

const mongodbConnect = (mongo) => {
  let mongoURL =
  `mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.database}?authSource=${mongo.authdb}`

  mongoose.connect(mongoURL)

  mongoose.connection.on('connected', () => {
    console.log('👏 Connect success!')
  })

  mongoose.connection.on('error', () => {
    console.log('😖 Connect fail!')
  })

  mongoose.connection.on('disconnected', () => {
    console.log('😌 Disconnect success!')
  })
}

module.exports = mongodbConnect
