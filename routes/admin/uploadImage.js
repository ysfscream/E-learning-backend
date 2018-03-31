const router = require('koa-router')()
const config = require('../../config')

const multer = require('koa-multer') //文件上传

router.prefix(`${config.apiVersion}/upload`)

//配置
let storage = multer.diskStorage({
  //文件保存路径
  destination(req, file, cb) {
    cb(null, 'public/uploads/images')
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
router.post('/image', upload.single('image'), async (ctx, next) => {
  ctx.body = {
    filename: ctx.req.file.filename//返回文件名
  }
})

module.exports = router
