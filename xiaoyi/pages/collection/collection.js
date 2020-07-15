const DB = wx.cloud.database()
let shoucanglist=[]
const PAGE = 10;
let index = 0
let number = 0;

Page({
  data: {
    currentIndexNav:'',
    jilu:[
      "收藏",
      "购买",
      "发布",
      "留言"
    ],
    splist:[],
    liuyanlist:[]
  },

  activeNav: function(e) {
    console.log(this.data.jilu[e.currentTarget.dataset.index])
    this.setData({
      currentIndexNav: e.currentTarget.dataset.index,
      splist:[],
      liuyanlist:[]
    })
    this.page = 0
    this.whichindex(e.currentTarget.dataset.index)
  },
  whichindex: function(tag) {
    wx.showLoading({
      title: '获取数据中',
    })
    if (tag == 0) {
      console.log("tag0")
      this.getshoucang()
    } else if(tag==2){
      console.log("tag2")
      this.getfabu()
    }else if(tag==1){
      this.getgoumai()
    }else{
      this.getliuyan()
    }
  },
  getshoucang: function(){
    let that =this
    wx.cloud.callFunction({
      name:"getfabu",
      data:{
        sjb:'shoucang'
      },
      success(res){
        console.log(res)
        shoucanglist=res.result.data
        if (shoucanglist.length == 0) {
          wx.hideLoading()
        } else {
          that.getsplist(0)
        }
      },
      fail(res){
        console.log("fail")
      }
    })
  },
  getgoumai: function(){
    let that = this
    wx.cloud.callFunction({
      name: "getfabu",
      data: {
        sjb: 'dingdan'
      },
      success(res) {
        console.log(res)
        shoucanglist = res.result.data
        if (shoucanglist.length == 0) { 
          wx.hideLoading()
        }else{
          that.getsplist(0)
        }
      },
      fail(res) {
        console.log("fail")
      }
    })
  },
  getsplist:function(i){
    let that = this
    wx.cloud.callFunction({
      name: "getsplist",
      data: {
        spid: shoucanglist[i].spid
      },
      success(res) {
        console.log(res)
        that.setData({
          splist: that.data.splist.concat(res.result.data)
        })
        if (i < shoucanglist.length-1) {
          i++
          that.getsplist(i)
          console.log(shoucanglist.length,i)
        }else if(i==shoucanglist.length-1){
          console.log('hide')
          wx.hideLoading()
        }
      }
    })
  },
  getfabu: function(){
    let that = this
    wx.cloud.callFunction({
      name: "getfabu",
      data: {
        sjb: 'shangpin'
      },
      success(res) {
        console.log(res)
        that.setData({
          splist: res.result.data
        })
        wx.hideLoading()
      },
      fail(res){
        wx.hideLoading()
      }
    })
  },
  getliuyan: function(){
    let that = this
    wx.cloud.callFunction({
      name: "getfabu",
      data: {
        sjb: 'liuyan'
      },
      success(res) {
        console.log(res)
        that.setData({
          liuyanlist: res.result.data
        })
        wx.hideLoading()
      },
      fail(res) {
        wx.hideLoading()
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
    let that = this
    this.setData({
      currentIndexNav:options.index
    })
    this.whichindex(options.index)
    // console.log(currentIndexNav)
  },
  onShow: function (options) {
    let that = this
    if (wx.getStorageSync('key')) {
      wx.removeStorage({
        key: 'key',
        success(res) {
          that.onLoad()
        }
      })
    }
  }
})