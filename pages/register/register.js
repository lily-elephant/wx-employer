// pages/register/register.js
var util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    phoneNumber: '',
    msg: '重新获取',
    second: 60,
    waitFlag: false,
    hash:'',
    tamp:'',
    identifyCode:'',
    pwd: '', 
    confirmPwd: '',
    nickname:'',
    registertype:''
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this;
    that.setData({
      phoneNumber: options.phone,
      registertype: options.registertype,
      hash: options.hash,
      tamp: options.tamp
    })
  },
  /*
  *获取验证码的值
  */
  getIdentify: function (e) {
    this.data.identifyCode = e.detail.value;
  },
  /**
   *获取密码值
   */
  getPwd: function (e) {
    this.data.pwd = e.detail.value;
  },
  /**
   *确认密码值
   */
  getConfirm: function (e) {
    this.data.confirmPwd = e.detail.value;
  },
  /*
   * 用户昵称
  */
  getNickname: function (e) {
    this.data.nickname = e.detail.value;
  },
  /* 
  * 点击重新获取
  */
  getCode: function () {
    var that = this;
    console.log(that.data.phone);
    var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
    if (!myreg.test(this.data.phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入有效的手机号码！',
        showCancel: false,
        duration: 2000
      })
      return false;
    }
    wx.request({
      url: app.globalData.url + 'user/getverifycode',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        username: that.data.phone,
        usertype: 'EMPLOYER',
        registertype: 2
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '验证码发送成功',
          })
          that.setData({
            hash: res.data.data.hash,
            tamp: res.data.data.tamp,
            waitFlag: true
          })
          util.countdown(that);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      }
    })
  },
  //注册
  registerTouch:function(){
    var that = this;
    if (that.data.identifyCode == null){
      wx.showToast({
        title: '验证码不能为空！',
      })
      return false;
    }
    if (that.data.pwd == null && that.data.confirmPwd == null && that.data.pwd != that.data.confirmPwd ){
      wx.showToast({
        title: '请确认密码！',
      })
      return false;
    }
    if (that.data.nickname == null){
      wx.showToast({
        title: '请输入昵称！',
      })
      return false;
    }
    wx.request({
      url: app.globalData.url + 'user/register',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        username: that.data.phoneNumber,  //17614924188
        usertype: 'EMPLOYER',
        password:that.data.pwd,
        verifycode: that.data.identifyCode,   //验证码
        registertype: '0', //0：注册 1：找回密码
        hash:that.data.hash,
        tamp:that.data.tamp,
        name:that.data.nickname
      },
      success:function(res){
        if(res.data.code == 200){
          //获取到用户的token 并保存
          wx.setStorageSync('token', res.data.data.Token)
          console.log(wx.getStorageSync('token'));
          wx.showToast({
            title: '注册成功！',
            icon:"success"
          })
          // wx.switchTab({
          //   url: '/pages/index/index',
          // })
          wx.navigateBack({
            delta: 3
          })
        }else{
          wx.showToast({
            title: res.data.msg
          })
        }
      }
    })
  }
})