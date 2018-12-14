// pages/meetsuccess/meetsuccess.js
Page({
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 暂定预约成功5秒后回到首页
    setTimeout(() => {
      wx.navigateBack({
        delta:3
      })
    },2000)
  }
})