const DB = wx.cloud.database()
let deletesrc=[]//原来的文件
let img = []//上传图片的云文件id
let src=[]//待上传图片的临时路径
let spid=''
Page({

  data: {
    shangpin:{},
    fenleibiaoqian: ['生活用品', '数码产品', '服饰鞋包', '家用电器', '书籍资料', '零食饮料', '娱乐健身', '其他'],
    index: 0,
  },
  //获取云文件的文件路径
  getimg: function(){
    var i=0
    src =[]
    for(i=0;i<deletesrc.length;i++){
      wx.cloud.downloadFile({
        fileID: deletesrc[i], // 文件 ID
        success: res => {
          // 返回临时文件路径
          console.log('res.tempFilePath',res.tempFilePath)
          src = src.concat(res.tempFilePath)
          console.log('src',src)
        },
        fail: console.error
      })
    }
 
  },
  //获取用户上传的图片
  shangchuan: function() {
    console.log('获取用户上传的图片desrc', deletesrc)
    let that = this
    var n = 5
    if (5 > that.data.shangpin.imgsrc.length > 0) {
      n = 5 - that.data.shangpin.imgsrc.length;
      wx.chooseImage({
        count: n,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          console.log("获取用户上传的图片ok", res)
          that.setData({
            'shangpin.imgsrc': that.data.shangpin.imgsrc.concat(res.tempFilePaths)
          })
          src = src.concat(res.tempFilePaths)
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
  shangchuanimg: function(i) {
    let that = this
    wx.cloud.uploadFile({
      cloudPath: 'shangping/' + new Date().getTime() + '.png', // 上传至云端的路径
      filePath: src[i], // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log("上传图片src", src)
        if(i<src.length-1){
          i++
          img = img.concat(res.fileID)
          that.shangchuanimg(i)
        } else if(i == src.length - 1) {
          img = img.concat(res.fileID)
          that.updata()
        }       
      },
    })
  },
  //获取用户输入的数据
  addname: function(e) {
    this.setData({
      'shangpin.name':e.detail.value
    })
  },
  addjianjie: function(e) {
    this.setData({
      'shangpin.jianjie': e.detail.value
    })
  },
  addprice: function(e) {
    this.setData({
      'shangpin.price': e.detail.value
    })
  },
  addprice2: function(e) {
    this.setData({
      'shangpin.price2': e.detail.value
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      'shangpin.fenlei' :this.data.fenleibiaoqian[e.detail.value]
    })
  },
  //点击修改
  xiugai: function(e) {
    console.log('点击修改desrc', deletesrc)
    let that = this
    if (that.data.shangpin.name.length === 0 || that.data.shangpin.jianjie.length === 0 || that.data.shangpin.imgsrc.length === 0 || that.data.shangpin.price.length === 0) {
      wx.showModal({
        title: '提示',
        content: '您还有未填写的信息，请填写充分再发布',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否确定修改商品信息',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showLoading({
              title: '修改数据中',
            })
            img = []
            that.shangchuanimg(0)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //删除云存储的图片
  deleteimg: function(i){
    console.log('删除云desrc',deletesrc)
    wx.cloud.deleteFile({
      fileList: deletesrc,
      success: res => {
        wx.hideLoading()
        console.log('删除云deleteok',res.fileList)
        if(i==1){
          wx.showModal({
            title: '',
            content: '修改成功',
            showCancel: false,
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
        }else if(i==2){
          wx.setStorage({
            key: "key",
            data: 'fabu',
            success(res) {
              wx.showModal({
                title: '',
                content: '删除成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 2,
                      success: function () {
                        console.log('成功！')
                      }
                    })
                  }
                }
              })
            }
          })
        }
      },
      fail: console.error
    })
  },
  //删除图片
  imgDelete: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgurl = this.data.shangpin.imgsrc;
    console.log('删除图片desrc', deletesrc)
    imgurl.splice(index, 1)

    src.splice(index, 1)
    console.log('删除图片src', src)
    that.setData({
      'shangpin.imgsrc': imgurl
    });
  },
  //将数据上传到数据库
  updata: function() {
    console.log('updata',img)
    let that=this
    DB.collection('shangpin').doc(spid).update({
      data: {
        name: that.data.shangpin.name,
        fenlei: that.data.shangpin.fenlei,
        jianjie: that.data.shangpin.jianjie,
        price: that.data.shangpin.price,
        price2: that.data.shangpin.price2,
        imgsrc: img,
      },
      complete(res){
        console.log(res)
      },
      success(res) {
        console.log('chenggong', res)
        wx.setStorage({
          key: "key",
          data: 'fabu',
          success(res) {
            that.deleteimg(1)
          }
        })
      },
      fail(res) {
        console.log('no', res)
      }
    })
  },
  //点击删除
  shanchu: function(e){
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确定删除商品信息',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除数据中',
          })
          console.log('用户点击确定')
          that.remove()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  remove:function(){
    let that=this
    wx.cloud.callFunction({
      name: "deletesp",
      data: {
        spid: spid,
        sjb:'shangpin'
      },
      success: function (res) {
        wx.cloud.callFunction({
          name: "delete",
          data: {
            spid: spid,
            sjb: 'shoucang'
          },
          success: function (res) {
            wx.cloud.callFunction({
              name: "delete",
              data: {
                spid: spid,
                sjb: 'liuyan'
              },
              success: function (res) {
                wx.cloud.callFunction({
                  name: "delete",
                  data: {
                    spid: spid,
                    sjb: 'dingdan'
                  },
                  success: function (res) {
                    that.deleteimg(2)
                  }
                })
              }
            })
          }
        })
      }
    })  
  },
  onLoad: function (options) {
    let that = this
    spid=options.id
    DB.collection('shangpin').doc(options.id).get({
      success(res){
        that.setData({
          shangpin:res.data,
          index: that.data.fenleibiaoqian.indexOf(res.data.fenlei)
        })
        deletesrc=res.data.imgsrc
        that.getimg()
        console.log('de',deletesrc)
      }
    })
  },
  onShow: function () {

  },

})