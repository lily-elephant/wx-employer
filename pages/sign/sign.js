// pages/sign/sign.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [], 
    pageindex: 1,
    pagecount: 10,
    globalimgeurl: app.globalData.imgeurl,
  },

  //事件处理函数
  dianZan: function (e) {
    if (wx.getStorageSync('token')) {
      var index = e.currentTarget.dataset.idx;
      var hkid = e.currentTarget.dataset.hkid;
      var that = this
      wx.request({
        url: app.globalData.url + 'source/getlike',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Token': wx.getStorageSync('token')
        },
        data: {
          hkid: hkid
        },
        success: function (res) {
          //console.log(res.data.message)
          if (res.data.message == '点赞成功') {
            that.data.lists[index].isLike = '1'
            var j = parseInt(that.data.lists[index].likeCount);
            that.data.lists[index].likeCount = j + 1
          } else if (res.data.message == '取消点赞成功') {
            that.data.lists[index].isLike = '0'
            var j = parseInt(that.data.lists[index].likeCount);
            that.data.lists[index].likeCount = j - 1
          }
          that.setData({
            list: that.data.lists
          })
        },
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  getSignList: function () {
    var that = this
    wx.request({
      url: app.globalData.url + 'order/interviewlist',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Token': wx.getStorageSync('token') },
      data: {
        pageindex: that.data.pageindex,
        pagecount: that.data.pagecount
      },
      success: function (res) {
        if (res.data.code == '200') {
          if (res.data.data != undefined) {

            for (var index in res.data.data) {
              res.data.data[index].hkidcard = that.getAges(res.data.data[index].hkidcard)
              if (res.data.data[index].headimageurl != null) {
                res.data.data[index].headimageurl = that.data.globalimgeurl + res.data.data[index].headimageurl
              } else {
                res.data.data[index].headimageurl = '../../asset/img/avatar.png'
              }
            }
            var list = res.data.data;
            that.data.lists = that.data.lists.concat(list)
            if (that.data.lists != null) {
              that.setData({
                records: that.data.lists
              })
            } else {
              that.setData({
                records: []
              })
            }
          } else {
            wx.showToast({
              title: '没有更多数据',
            })
            if (that.data.pageindex == 1) {
              that.setData({
                records: []
              })
            }
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      complete: function (res) {
        wx.stopPullDownRefresh();
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSignList()
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
    this.data.pageindex = 1
    this.data.lists = []
    this.getSignList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageindex += 1
    this.getSignList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getAges: function (identityCard) {
    var len = (identityCard + "").length;
    if (len == 0) {
      return 0;
    } else {
      if ((len != 15) && (len != 18)) {
        return 0;
      }
    }
    var strBirthday = "";
    if (len == 18) {
      strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
    }
    if (len == 15) {
      strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
    }
    //时间字符串里，必须是“/”
    var birthDate = new Date(strBirthday);
    var nowDateTime = new Date();
    var age = nowDateTime.getFullYear() - birthDate.getFullYear();
    //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
})