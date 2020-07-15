const DB = wx.cloud.database()
const PAGE = 20;
let index = 0
let number = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lunbotulist:[],
    shangpinlist:[],
  },
  //下拉刷新
  onPullDownRefresh:function(){
    console.log("shuaxin")
    number=0
    this.getshangpin(true)
  },
  //分页
  onReachBottom: function () {
    this.getshangpin(false)
  },
  getlunbo(){
    let that=this
    //获取轮播图图片数据
    DB.collection("img").get({
      success(res) {
        console.log("success", res)
        that.setData({
          lunbotulist: res.data
        })
      },
      fail(res) {
        console.log("fail", res)
      }
    })
  },
  getshangpin(isInit){
    let that =this;
    wx.showLoading({
      title: '加载中',
    })
    //获取商品数据
    wx.cloud.callFunction({
      name:'getsp',
      data:{
        number:number,
        order:'liulan',
        PAGE:PAGE,
      },
      success(res) {
        index = res.result.data.length
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
              shangpinlist: res.result.data
            })
            wx.stopPullDownRefresh()
          } else {
            //分页加载
            that.setData({
              shangpinlist: that.data.shangpinlist.concat(res.result.data)
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
  gotocommodity(e) {
    console.log(e);
    const id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/commodity/commodity?id=' + id,
    })
  },
  gotoPublish() {
    let that = this
    wx.cloud.callFunction({
      name: "getmyinfo",
      success(res) {
        console.log('callFunction test result: ', res)
        if (res.result.data.length > 0) {
          wx.navigateTo({
            url: '/pages/publish_information/publish_information',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您还没有授权，请先在【我的】完成授权',
            showCancel:false
          })
        }
      }
    })
  },
  gotosao(){
    wx.navigateTo({
      url: '/pages/sao/sao',
    })
  },
  gotohelp() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  onLoad: function (options) { 
    console.log('options',options) 
    number = 0;
    this.getlunbo();
    this.getshangpin(true);
  },
  onShow: function () {
    let that=this
    if (wx.getStorageSync('key')){
      wx.removeStorage({
        key: 'key',
        success(res) {
          that.onLoad()
        }
      })
    }
  },
})