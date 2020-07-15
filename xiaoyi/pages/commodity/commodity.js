var util = require('../../utils/util.js');
const DB = wx.cloud.database()
let spid=''
let liuyan=''
let userInfo={}
Page({
  data: {
    shangpin: {},
    user: {},
    buyer:{},
    scurl:"../../images/icons/shoucang.png",
    shoucang:false,
    liuyanlist:[],
    isseller:false,
  },
  //获取卖家信息
  getseller: function(openid){
    let that = this
    DB.collection('user').where({
      _openid: openid
    }).get({
      success: function (res) {
        console.log('user', res.data)
        that.setData({
          user: res.data[0],
        })
      }
    })
  },
  //判断是否为卖家
  seller: function(){
    console.log('seller')
    let that = this
    wx.cloud.callFunction({
      name: "getopenid",
      success(res) {
        if(res.result.openid===that.data.user._openid){
          that.setData({
            isseller: true,
          })
        }else{
          isseller: false
        }
      }
    })
  },
  //获取收藏状态
  getshoucang: function(id){
    let that = this
    wx.cloud.callFunction({
      name: "getsc",
      data: {
        spid: id
      },
      success(res) {
        console.log('shoucang: ', res)
        if (res.result.data.length > 0) {
          that.setData({
            scurl: "../../images/icons/shoucang2.png",
            shoucang: true
          })
        } else {
          that.setData({
            scurl: "../../images/icons/shoucang.png",
            shoucang: false
          })
        }
      }
    })
  },
  //放大图片
  imgyulan: function (event) {
    var that = this;
    console.log(event)
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = that.data.shangpin.imgsrc;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //点击收藏事件
  clicksc: function(){
    let that = this
    wx.cloud.callFunction({
      name: "getmyinfo",
      success(res) {
        console.log('callFunction test result: ', res)
        if (res.result.data.length > 0) {
          that.clickshoucang()
        } else {
          wx.showModal({
            title: '提示',
            content: '您还没有授权，请先在【我的】完成授权',
            showCancel: false
          })
        }
      }
    })
  },
  clickshoucang: function(){
    const SP = DB.collection('shangpin').doc(spid)
    let that =this
    if(this.data.shoucang){
      that.setData({
        scurl: "../../images/icons/shoucang.png",
        shoucang:false
      })
      wx.cloud.callFunction({
        name: "getsc",
        data: {
          spid: spid
        },
        success(res) {
          console.log('shoucang?: ', res)
          DB.collection("shoucang").doc(res.result.data[0]._id).remove({
            success: function (res) {
              console.log("shanchu",res.data)
              wx.cloud.callFunction({
                name: 'updatainc',
                data: {
                  num1:-1,
                  num2:0,
                  num3:0,
                  spid: spid
                },
                success(res) {
                }
              })
            }
          })
        }
      })
    }else{
      that.setData({
        scurl: "../../images/icons/shoucang2.png",
        shoucang:true
      })
      DB.collection('shoucang').add({
        data: {
          spid: spid
        },
        success(res) {
          wx.cloud.callFunction({
            name: 'updatainc',
            data: {
              num1: 1,
              num2: 0,
              num3: 0,
              spid: spid
            },
            success(res) {
            }
          })
          console.log('shoucangyes', res)
        },
        fail(res) {
          console.log('shoucangno', res)
        }
      })
      
    }
  },
  //获取输入内容
  addliuyan: function(e) {
    liuyan = e.detail.value
  },
  //获取留言列表
  getliuyan: function(){
    let that =this
    DB.collection('liuyan').where({
      spid:spid
    }).orderBy('date', 'desc').get({
      success: function (res) {
        console.log("liuyanlist",res.data)
        that.setData({
          liuyanlist:res.data
        })
      }
    })
  },
  //发送留言
  fasong: function(e){
    let that = this
    wx.cloud.callFunction({
      name: "getmyinfo",
      success(res) {
        console.log('callFunction test result: ', res)
        if (res.result.data.length > 0) {
          if(liuyan.length===0){
            wx.showModal({
              title: '提示',
              content: '您还未填写留言，请填写后再发送',
              showCancel: false
            })
          }else{
            userInfo = res.result.data[0]
            console.log("yes")
            var time = util.formatTime(new Date());
            that.updata(time)
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '您还没有授权，请先在【我的】完成授权',
            showCancel: false
          })
        }
      }
    })
  },
  //上传数据
  updata: function(t){
    let that =this
    DB.collection('liuyan').add({
      data: {
        seller:that.data.shangpin._openid,
        spid:spid,
        liuyan:liuyan,
        date: DB.serverDate(),
        username: userInfo.name,
        userimg:userInfo.imgsrc,
        time:t,
        new:true,
      },
      success(res) {
        console.log('chenggong', res)
        wx.cloud.callFunction({
          name: 'updatainc',
          data: {
            num1: 0,
            num2: 0,
            num3: 1,
            spid: spid
          },
          success(res) {
          }
        })
        that.getliuyan()
      },
      fail(res) {
        console.log('no', res)
      }
    })
  },
  //点击购买
  goumai: function() {
    let that = this
    wx.cloud.callFunction({
      name: "getmyinfo",
      success(res) {
        console.log('callFunction test result: ', res)
        if (res.result.data.length > 0) {
          that.pay()
        } else {
          wx.showModal({
            title: '提示',
            content: '您还没有授权，请先在【我的】完成授权',
            showCancel: false
          })
        }
      }
    })
  },
  pay: function(){
    let that =this
    const SP = DB.collection('shangpin').doc(spid)
    wx.showModal({
      title: '这是个支付页面',
      content: '是否花费' + that.data.shangpin.price +'元购买',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var t = util.formatTime(new Date());
          DB.collection('dingdan').add({
            data: {
              seller: that.data.shangpin._openid,
              spid: spid,
              date: DB.serverDate(),
              new:true,
              time: t,
            },
            success(res) {
              console.log('chenggong', res)
              wx.cloud.callFunction({
                name:'goumai',
                data:{
                  id:spid
                },
                success(res) {
                  wx.showToast({
                    title: '购买成功',
                    icon: 'success',
                    duration: 2000
                  })
                  wx.setStorage({
                    key: "key",
                    data: true,
                    success(res) {
                      wx.navigateBack({
                        delta: 1,
                        success: function () {
                          console.log('成功！')
                        }
                      })
                    }
                  })   
                },
                fail(res){
                  console.log('sb', res)
                }
              })
            },
            fail(res){
              console.log('shibai', res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //点击修改
  gotoxiugai: function(e){
    console.log('e',e)
    wx.navigateTo({
      url: '/pages/xiugai/xiugai?id='+spid,
    })
  },
  //获取买家信息
  getbuyer: function(){
    let that = this
    DB.collection('dingdan').where({
      spid:spid
    }).get({
      success: function (res) {
        console.log('dingdan',res)
        DB.collection('user').where({
          _openid: res.data[0]._openid
        }).get({
          success: function (res) {
            console.log('buyer', res.data)
            that.setData({
              buyer: res.data[0],
            })
          }
        })
      },
      fail(res){
        console.log('dingdanshibai', res)
      }
    })
  },
  onLoad: function (options) {
    console.log("op", options)
    spid=options.id
    let that = this
    const SP = DB.collection('shangpin').doc(spid)
    //获取商品信息
    wx.cloud.callFunction({
      name: 'updatainc',
      data: {
        num1: 0,
        num2: 1,
        num3: 0,
        spid: spid
      },
      success(res) {
        SP.get({
          success: function (res) {
            console.log("shangpin", res.data._openid)
            that.setData({
              shangpin: res.data,
            })
            console.log("u", res.data._openid)
            //获取卖家信息
            that.getseller(res.data._openid)
            //获取收藏状态
            that.getshoucang(spid)
            //获取留言信息
            that.getliuyan()
            //判断是否为卖家
            that.seller()
            if (!that.data.shangpin.sell) {
              that.getbuyer()
            }
          }
        })
      }
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
})