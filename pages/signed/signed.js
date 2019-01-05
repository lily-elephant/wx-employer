// pages/signed/signed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signer: {}, // 签约人信息
  },
  // 事件处理函数
  // 点赞
  onZan(e) {
    // ps：面试列表接口暂无点赞字段2019/01/03/23:23
    let index = e.detail.index;
    if (e.detail.message == '点赞成功') {
      this.data.signer.isLike = '1'
      var j = parseInt(this.data.signer.likeCount);
      this.data.signer.likeCount = j + 1
    } else if (e.detail.message == '取消点赞成功') {
      this.data.signer.isLike = '0'
      var j = parseInt(this.data.signer.likeCount);
      this.data.signer.likeCount = j - 1
    }
    this.setData({
      signer: this.data.signer
    })
  },
  // 下载合同
  download(){
    console.log(this.data.downloadurl)
    wx.downloadFile({
      url: this.data.downloadurl, 
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.playVoice({
            filePath: res.tempFilePath
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      signer: options,
      downloadurl: options.downloadurl
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