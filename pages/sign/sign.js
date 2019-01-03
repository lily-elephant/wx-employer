// pages/sign/sign.js
import { getAge } from '../../utils/util.js';
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
  // 点赞
  onZan(e) {
    // ps：面试列表接口暂无点赞字段2019/01/03/23:23
    let index = e.detail.index;
    if (e.detail.message == '点赞成功') {
      this.data.lists[index].isLike = '1'
      var j = parseInt(this.data.lists[index].likeCount);
      this.data.lists[index].likeCount = j + 1
    } else if (e.detail.message == '取消点赞成功') {
      this.data.lists[index].isLike = '0'
      var j = parseInt(this.data.lists[index].likeCount);
      this.data.lists[index].likeCount = j - 1
    }
    this.setData({
      records: this.data.lists
    })
  },
  // 点击已签约
  signed(){
    wx.navigateTo({
      url: '../signed/signed',
    })
  },
  // 获取已签约列表
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
              // start 数据字段名不一致，为保证子组件通用而写
              res.data.data[index].name = res.data.data[index].hkname
              res.data.data[index].idcard = getAge(res.data.data[index].hkidcard)
              // end 数据字段名不一致，为保证子组件通用而写
              // 如果字段名称一致，写法如下
              // res.data.data[index].hkidcard = getAge(res.data.data[index].hkidcard)
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
  // getAges: function (identityCard) {
  //   var len = (identityCard + "").length;
  //   if (len == 0) {
  //     return 0;
  //   } else {
  //     if ((len != 15) && (len != 18)) {
  //       return 0;
  //     }
  //   }
  //   var strBirthday = "";
  //   if (len == 18) {
  //     strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
  //   }
  //   if (len == 15) {
  //     strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
  //   }
  //   //时间字符串里，必须是“/”
  //   var birthDate = new Date(strBirthday);
  //   var nowDateTime = new Date();
  //   var age = nowDateTime.getFullYear() - birthDate.getFullYear();
  //   //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  //   if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   return age;
  // }
})