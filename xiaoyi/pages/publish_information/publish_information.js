var util = require('../../utils/util.js');
const DB=wx.cloud.database()
let name = ""
let fenlei = "生活用品"
let jianjie = ""
let price = ""
let price2 = ""
let imgsrc = []
Page({
  /**
   * 初始数据
   */
  data:{
    fenleibiaoqian: [ '生活用品', '数码产品', '服饰鞋包', '家用电器', '书籍资料', '零食饮料', '娱乐健身', '其他'],
    index: 0,
    imgurl:[],
  },
  //获取用户上传的图片
  shangchuan: function(){
    let that = this
    var n = 5
    if (5 > that.data.imgurl.length > 0) {
      n = 5 - that.data.imgurl.length;
      wx.chooseImage({
        count: n,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          console.log("ok", res)
          that.setData({
            imgurl: that.data.imgurl.concat(res.tempFilePaths)
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '上传图片数量已达上限',
        showCancel: false
      })
    }
  },
  //上传图片并返回云存储文件id保存至imgsrc字符串处
  shangchuanimg: function(i){
    console.log('shangchuanimg',i)
    let that = this
    wx.cloud.uploadFile({
      cloudPath: 'shangping/' + new Date().getTime() + '.png', // 上传至云端的路径
      filePath: that.data.imgurl[i], // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log("上传图片src", that.data.imgurl)
        if (i < that.data.imgurl.length - 1) {
          i++
          imgsrc = imgsrc.concat(res.fileID)
          console.log('imgsrc', imgsrc)
          that.shangchuanimg(i)
        } else if (i == that.data.imgurl.length - 1) {
          imgsrc = imgsrc.concat(res.fileID)
          var time = util.formatTime(new Date());
          that.updata(time)
        }
      },
      fail: console.error
    })
  },
 //获取用户输入的数据
  addname: function(e){
    name = e.detail.value
  },
  addjianjie: function(e) {
    jianjie = e.detail.value
  },
  addprice: function(e) {
    price = e.detail.value
  },
  addprice2: function(e) {
    price2 = e.detail.value
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
    })
    fenlei = this.data.fenleibiaoqian[e.detail.value]
  },
  //点击发布
  fabu: function(){
    let that = this
    if (name.length===0||jianjie.length===0||that.data.imgurl.length===0||price.length===0){
      wx.showModal({
        title: '提示',
        content: '您还有未填写的信息，请填写充分再发布',
        showCancel: false
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '是否发布商品',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '上传数据中',
            })
            let imgsrc = []
            console.log('用户点击确定',imgsrc)
            
            that.shangchuanimg(0)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //点击删除
  imgDelete: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgurl = this.data.imgurl;
    imgurl.splice(index, 1)
    that.setData({
      imgurl:imgurl
    });
  },
  //将数据上传到数据库
  updata: function(t){
    DB.collection('shangpin').add({
      data:{
        name:name,
        fenlei:fenlei,
        jianjie:jianjie,
        price:price,
        price2:price2,
        imgsrc:imgsrc,
        liulan:0,
        shoucang:0,
        liuyan:0,
        date: t,
        time: DB.serverDate(),
        sell:true
      },
      success(res) {
        console.log('chenggong',res)
        wx.setStorage({
          key: "key",
          data: 'fabu',
          success(res) {
            wx.hideLoading()
            wx.showModal({
              title: '恭喜',
              content: '发布成功',
              showCancel:false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1,
                    success: function () {
                      console.log('成功！')
                    }
                  })
                } 
              }
            })
          }
        })   
      },
      fail(res){
        console.log('no', res)
      }
    })
  },
  onLoad:function(options){
    let imgsrc = []
  }
})