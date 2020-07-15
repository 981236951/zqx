const DB = wx.cloud.database()
const PAGE = 20;
let index = 0
let number = 0;
let gjz=''
Page({
  data: {
    splist:[]
  },
  sousuo: function(e){
    gjz = e.detail.value
  },
  getsp: function(e){
    if(gjz.length==0){
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 2000
      })
    }else{
      number = 0;
      this.getshangpin(true)
    }
  },
  getshangpin: function(isInit){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    //获取商品数据
    DB.collection("shangpin").where({
      sell: true,
      name: DB.RegExp({
        regexp: gjz,
        options: 'i',
      })
    }).skip(number).limit(PAGE).get({
      success(res) {
        index = res.data.length
        if (index == 0) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
        } else {
          number += index
          console.log("success", res)
          if (isInit) {
            that.setData({
              splist: res.data
            })
            wx.stopPullDownRefresh()
          } else {
            //分页加载
            that.setData({
              splist: that.data.splist.concat(res.data)
            })
          }
          wx.hideLoading()
        }
      },
      fail(res) {
        console.log("fail", res)
      }
    })
  },
  onReachBottom: function () {
    this.getshangpin(false)
  },
  onLoad: function (options) {
    number = 0;
  },
});