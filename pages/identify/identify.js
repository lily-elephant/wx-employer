// pages/registerone/registerone.js
var app = getApp();
Page({
  data: {
    registertype: null,
    navName: null,
    phone:null,
    verifycode:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    //options为页面路由过程中传递的参数
    var that = this;
    this.setData({
      registertype: options.registertype
    })
    if (that.data.registertype == 0){
      that.data.navName = '注册';
    } else if (that.data.registertype == 1){
      that.data.navName = '忘记密码';      
    }else{
      that.data.navName = '修改密码';            
    }
    wx.setNavigationBarTitle({
      title: that.data.navName //页面标题为路由参数
    })
  },
  getPhone: function(e){
    this.data.phone = e.detail.value;
  },
  /**
   * 直接登录
   */
  goLogin: function(){
    wx.redirectTo({
      url: '../login/login'
    })
  },
  /**
   * 下一步
   */
  next:function(){
    var that = this;
    var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
    if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '请输入有效的手机号码！',
        duration: 2000
      })
      return false;
    }
    wx.request({
      url: app.globalData.url + 'user/getverifycode',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        username: that.data.phone,  //17614924188
        usertype: 'EMPLOYER',
        registertype: that.data.registertype
      },
      success:function(res){
        console.log(res)
        if(res.data.code == 200){
          wx.showToast({
            title: '验证码发送成功',
          })
          var hash = res.data.data.hash;
          var tamp = res.data.data.tamp;
          if (that.data.registertype == 0) {
            wx.navigateTo({     //注册
              url: '../register/register?phone=' + that.data.phone + '&registertype=0&hash=' + hash + '&tamp=' + tamp
            })
          } else if (that.data.registertype == 1) {
            wx.navigateTo({    //表示找回密码
              url: '../findpwd/findpwd?registertype=1&phone=' + that.data.phone + '&hash=' + hash + '&tamp=' + tamp
            })
          } else {
            wx.navigateTo({    //表示修改密码
              url: '../findpwd/findpwd?registertype=1&phone=' + that.data.phone + '&hash=' + hash + '&tamp=' + tamp
            })
          }
        }else{          
          wx.showToast({
            title: res.data.message
          })
        }
      }
    })
  }
})