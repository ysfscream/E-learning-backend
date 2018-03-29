// 对数组进行分页
const pageNation = (page, pageSize, array) => {
  const offset = (page - 1) * pageSize
  return ((offset + pageSize)  >= array.length)
           ? array.slice(offset, array.length)
            : array.slice(offset, offset + pageSize)
}

module.exports = pageNation

