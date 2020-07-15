const DB = wx.cloud.database()
let user = {}

Page({
  data: {
    userInfo: {},
    isShow: false,
    openid:'',
    jilu: [
      { text: "收藏", icon: "../../images/icons/icon6.png"},
      { text: "购买", icon: "../../images/icons/icon7.png"},
      { text: "发布", icon: "../../images/icons/icon2.png"},
      { text: "留言", icon: "../../images/icons/icon3.png"}
    ],
  },
  onLoad: function () {
    this.isuser()
  },
  isuser: function(){
    let that = this
    wx.cloud.callFunction({
      name: "getmyinfo",
      success(res) {
        console.log('callFunction test result: ', res)
        if (res.result.data.length > 0) {
          that.setData({
            isShow: false,
            userInfo: res.result.data[0]
          })
        } else {
          that.setData({
            isShow: true
          })
        }
      }
    })
  },
  getuser: function() {
    let that=this
    //获取用户信息
    that.setData({
     isShow: false
    })
    wx.getUserInfo({
      success: (res) => {
        user= res.userInfo
        console.log("6",user)
        that.setuser()
      },
      fail: (res) => {
        console.log("调用了失败的回调");
      }
    });
  },

  setuser: function() {
    console.log("a ",user)
    DB.collection('user').add({
      data: {
        name: user.nickName,
        imgsrc: user.avatarUrl,
        gender: user.gender,
        language: user.language,
      },
      success(res) {
        console.log('chenggong', res)
      },
      fail(res) {
        console.log('no', res)
      }
    })
  },
  
  isGetinfo: function(data) {
    let that=this
    if (data.detail.rawData) {
      //点击了允许
      console.log("允许");
      that.getuser()
    } else {
      //点击了不允许
      console.log("不");
    }
  },

  gojilu: function(e){
    console.log(e.currentTarget.dataset.index)
    let that = this
    wx.cloud.callFunction({
      name: "getmyinfo",
      success(res) {
        console.log('callFunction test result: ', res)
        if (res.result.data.length > 0) {
          wx.navigateTo({
            url: '/pages/collection/collection?index=' + e.currentTarget.dataset.index,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您还没有授权，请先在【我的】完成授权',
            showCancel: false
          })
        }
      }
    })
  }
}) 