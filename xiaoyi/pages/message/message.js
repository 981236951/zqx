const DB = wx.cloud.database()
let splist=[]
let index = 0
let dingdanlist= []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndexNav: '',
    list: [
      "未读留言",
      "全部留言",
      "新订单"
    ],
    liuyanlist:[],
    splist:[]
  },
  activeNav: function(e) {
    this.setData({
      currentIndexNav: e.currentTarget.dataset.index,
    })
    this.whichindex(e.currentTarget.dataset.index)
  },
  whichindex: function(index){
    wx.showLoading({
      title: '获取数据中',
    })
    let that =this
    if(index==0){
      that.setData({
        liuyanlist: []
      })
      that.getnewliuyan()
    }else if(index==1){
      that.setData({
        liuyanlist: []
      })
      that.getliuyan()
    }
    else if(index==2){
      that.setData({
        splist: []
      })
      that.getdingdan()
    }
  },
  getnewliuyan: function(){
    let that = this
    wx.cloud.callFunction({
      name: "getnewly",
      success(res) {
        console.log(res)       
        that.setData({
          liuyanlist: res.result.data
        })  
        wx.hideLoading()   
      }
    })
  },
  getliuyan:function(){
    let that = this
    wx.cloud.callFunction({
      name: "getliuyan",
      success(res) {
        console.log(res)
        that.setData({
          liuyanlist: res.result.data
        })
        wx.hideLoading()
      }
    })
  },
  getdingdan: function(){
    let that = this
    wx.cloud.callFunction({
      name: "getnewdd",
      success(res) {
        console.log('dd',res)
        dingdanlist=res.result.data
        console.log('dd', dingdanlist)
        if (dingdanlist.length>0){
          that.getsplist(0) 
        }else{wx.hideLoading()}      
      }
    })
  },
  getsplist:function(i){
    let that = this
    DB.collection('shangpin').doc(dingdanlist[i].spid).get({
      success(res) {
        console.log(res)
        that.setData({
          splist: that.data.splist.concat(res.data)
        })
        if (i < dingdanlist.length-1) {
          i++
          that.getsplist(i)
        } else if(i==dingdanlist.length-1){
          wx.hideLoading() 
        }
      } 
    })        
  },
  gotocommodityly:function(e){
    const id = e.currentTarget.id;
    wx.cloud.callFunction({
      name:'updatanew',
      data:{
        spid:id,
        sjb:'liuyan'
      },
      success(res){
        wx.navigateTo({
          url: '/pages/commodity/commodity?id=' + id,
        })
        this.getmessage()
      }
    })
  },
  gotocommoditydd: function (e) {
    const id = e.currentTarget.id;
    wx.cloud.callFunction({
      name: 'updatanew',
      data: {
        spid: id,
        sjb: 'dingdan'
      },
      success(res) {
        wx.navigateTo({
          url: '/pages/commodity/commodity?id=' + id,
        })
        this.getdingdan()
      }
    })
  },
  gotocommodity:function(e){
    const id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/commodity/commodity?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.cloud.callFunction({
      name: "getfabu",
      success(res) {
        console.log(res)
        splist=res.result.data
        that.whichindex(0)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})