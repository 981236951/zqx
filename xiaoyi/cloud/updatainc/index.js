// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  await cloud.database().collection('shangpin').doc(event.spid).update({
    data: {
      shoucang: cloud.database().command.inc(event.num1),
      liulan: cloud.database().command.inc(event.num2),
      liuyan: cloud.database().command.inc(event.num3)
    }
  })
}