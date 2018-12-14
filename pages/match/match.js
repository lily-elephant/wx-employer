// pages/match/match.js
var app = getApp()
Page({
  data: {
    count: '6000-8000', //匹配的月薪范围
  },
  /**
   * 跳转到修改需求
   */
  change:function(){
    // state为0时表示修改需求提交后进入match页
    // wx.navigateTo({
    //   url: '../editneed/editneed?state=0',
    // })
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 点击可以跳转，暂跳转到首页
   */
  agree:function(){
    //是否登录 未登录 登录 
    if(wx.getStorageSync('token')){
      wx.request({
        url: app.globalData.url + 'exam/addresults',
        method: 'POST',
        header: { 
          'content-type': 'application/x-www-form-urlencoded' ,
          'Token':wx.getStorageSync('token')
        },
        data: {
          answer: JSON.stringify(wx.getStorageSync('userNeed')),
        },
        success: function (res) {
          
          if (res.data.code == 200) {
          wx.switchTab({
            url: '../index/index'
          }) 
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
    
  },
})