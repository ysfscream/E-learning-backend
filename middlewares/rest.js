module.exports = {
  // rest 中间件 格式化输出的 JSON 数据，rest 方法传入 状态，信息，数据和其它信息
  restify: () => {
    return async (ctx, next) => {
      ctx.rest = (status, message, data, meta = {}) => {
        ctx.response.type = 'application/json'
        ctx.response.status = status        
        ctx.body = { 
          status, 
          message, 
          meta, 
          items: data 
        }
      }
      try {
        await next()
      } catch (error) {
        ctx.response.type = 'application/json'        
        ctx.response.status = error.status
        ctx.body = {
          status: error.status,
          message: error.message,
        }
      }
    }
  },
}