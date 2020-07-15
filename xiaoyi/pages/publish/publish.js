const DB = wx.cloud.database()
let index = 0
let number = 0;
let PAGE =20
Page({

  data: {
    currentIndexNav: 0,
    fenlei: [
       "全部商品" ,
       "生活用品" ,
       "数码产品" ,
       "服饰鞋包" ,
       "家用电器" ,
       "书籍资料" ,
       "零食饮料" ,
       "娱乐健身" ,
       "其他" 
    ],
    shangpinlist: []
  },

  activeNav: function(e) {
    number=0
    console.log(this.data.fenlei[e.currentTarget.dataset.index])
    this.setData({
      currentIndexNav: e.currentTarget.dataset.index,
      shangpinlist: []
    })
    this.page=0
    this.whichtag(true)
  },
  whichtag: function(istrue){
    if (this.data.currentIndexNav == 0) {
      this.getspall(istrue)
    } else {
      this.getsptag(istrue, this.data.fenlei[this.data.currentIndexNav])
    }
  },
  getsptag: function(isInit,tag){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    //获取商品数据
    wx.cloud.callFunction({
      name: 'getsp',
      data: {
        number: number,
        order:'time',
        PAGE: PAGE,
        tag:tag
      },
      success(res) {
        let num=0
        num = res.result.data.length
        if (num == 0) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
        } else {
          number += num
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
  getspall: function(isInit){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    //获取商品数据
    wx.cloud.callFunction({
      name: 'getsp',
      data: {
        number: number,
        order:'time',
        PAGE: PAGE,
      },
      success(res) {
        let num = 0
        num = res.result.data.length
        if (num == 0) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
        } else {
          number += num
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
  gotocommodity: function(e) {
    console.log(e);
    const id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/commodity/commodity?id=' + id,
    })
  },
  onLoad: function (options) {
    number = 0;
    this.getspall(true);
  },
  onPullDownRefresh: function () {
    number = 0;
    this.whichtag(true)
  },
  onReachBottom: function () {
    this.whichtag(false)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    if (wx.getStorageSync('key')) {
      wx.removeStorage({
        key: 'key',
        success(res) {
          that.onLoad()
        }
      })
    }
  },

})