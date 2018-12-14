// pages/knowledge/knowledge.js
var app = getApp()
Page({
  data: {
    globalimgeurl: app.globalData.imgeurl
  },
  next:function(){
    wx.setStorageSync('isSee', true)
    wx.navigateTo({
      url: '../publish/publish',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    wx.request({
      url: app.globalData.url + 'source/articlelist',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        pageindex: 1,
        pagecount: 1,
        name: "用户须知"
      },
      success: function (res) {
        if(res.data.data != null){
          if (res.data.data.size != 0) {
            var obj = JSON.parse(res.data.data[0].content);
            that.setData({
              list: obj
            })
          }
        }
      }
    })
  }
})