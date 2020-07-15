// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await cloud.database().collection(event.sjb).where({spid:event.spid}).remove({
    success: function (res) {
    }
  })
}