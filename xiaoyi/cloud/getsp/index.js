// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection("shangpin").orderBy(event.order, 'desc').where({
      sell: true,
      fenlei: event.tag,
    }).skip(event.number).limit(event.PAGE).get({
    success(res) {
      return res.data
    },
  })
}