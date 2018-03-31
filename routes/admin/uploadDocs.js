const router = require('koa-router')()
const config = require('../../config')

const multer = require('koa-multer') //文件上传

router.prefix(`${config.apiVersion}/upload`)

//配置
let storage = multer.diskStorage({
  //文件保存路径
  destination(req, file, cb) {
    cb(null, 'public/uploads/docs')
  },
  //修改文件名称
  filename(req, file, cb) {
    let fileFormat = (file.originalname).split(".")
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1])
  }
})

//加载配置
let upload = multer({ storage: storage });

//路由
router.post('/docs', upload.single('docs'), async (ctx, next) => {
  ctx.body = {
    filename: ctx.req.file.filename//返回文件名
  }
})

module.exports = router
