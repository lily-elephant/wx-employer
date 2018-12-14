var app = getApp()
Page({
  data: {
    name: '', // 雇主姓名
    imgUrl: '', // 头像
    phoneNum: '', // 电话号码
    isShow:false
  },
  //判断是否登录未登录登录
  goLogin:function(){
    if(!wx.getStorageSync("token")){
      this.login()
    }
  },
  // 更换头像 
  changeAvatar: function(){
    var _that = this 
    if (wx.getStorageSync("token")) {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          //对pic1赋值
          _that.data.imgUrl = tempFilePaths;
          _that.setData({
            imgUrl: tempFilePaths,
          })
          wx.uploadFile({
            url: app.globalData.url + 'uploadImage',
            method: 'POST',
            header: {
              'content-type': 'multipart/form-data',
              'Token': wx.getStorageSync('token')
            },
            filePath: tempFilePaths[0],
            name: 'pic',
            success: function (res) {
              console.log(res);
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      })
    } else {
      this.login()
    }
    
  },
  // 进入个人信息
  goInfo: function(){
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '../personalinfo/personalinfo',
      })
    } else {
      this.login()
    }
  },
  // 进入我的订单
  goMyorder: function(){
    if(wx.getStorageSync("token")){
      wx.navigateTo({
        url: '../order/order',
      })
    }else{
      this.login()
    }
  },
  // 进入我的消息
  goMyinfo: function(){
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '../myinfo/myinfo',
      })
    } else {
      this.login()
    }  
  },
  // 进入意见反馈
  goFeedback: function () {
    if(wx.getStorageSync('token')){
      wx.navigateTo({
        url: '../feedback/feedback',
      })
    }else{
      this.login()
    }
    
  },
  // 进入关于我们
  goAboutus: function () {
    wx.navigateTo({
      url: '../aboutus/aboutus',
    })
  },
  // 进入修改密码
  goChangepwd: function () {
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '../identify/identify?registertype=2',
      })
    } else {
      this.login()
    }
  },
  // 退出
  logout: function(){
    var that = this 
    wx.showModal({
      title: '温馨提示',
      content: '退出后不会删除任何历史数据，下次登录依然可以使用本账号。',
      success: function (res) {
        if (res.confirm) {
          // 清除登录状态
          wx.clearStorageSync('token');
          that.login()
        } 
      }
    })
  },
  //跳转到登录页
  login(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  onShow: function () {
    var that = this ; 
    if(wx.getStorageSync('token')){
      that.data.isShow = false
      this.auth()  
    }else{
      //console.log(that.data.name , 3)
      that.data.isShow = true
      that.setData({
        name: "未登录",
        phoneNum: "未登录",
        imgUrl: "../../asset/img/logo.png",
        isShow: that.data.isShow
      })
    }
  } , 
  //获取用户基本信息 
  auth:function(){
    var that = this 
    //console.log(wx.getStorageSync('token'))
    wx.request({
      url: app.globalData.url + 'auth',
      method: 'POST',
      header: { 
        'content-type': 'application/x-www-form-urlencoded', 
        Token : wx.getStorageSync('token')
         },
      success: function (res) {
        //console.log(res.data.data)
        if (res.data.code == 200) {
          if (res.data.data.headimageurl != null){
            that.data.imgUrl = app.globalData.imgeurl + res.data.data.headimageurl
          }else{
            that.data.imgUrl = '../../asset/img/logo.png'
          }
          that.setData({
            name: res.data.data.name,
            phoneNum: res.data.data.username,
            imgUrl:that.data.imgUrl,
            isShow: that.data.isShow
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      }
    })
  }  
})