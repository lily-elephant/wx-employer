import { getAge } from '../../utils/util.js';
import { ListModel } from '../../models/list.js'
import { errorok } from '../../config.js'
const listModel = new ListModel()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    startpage: 1,
    pageCount: 10,
    globalimgeurl: app.globalData.imgeurl,
    filterFlag: true, // 筛选条件显示与否
  },

  // 点击筛选
  filter() {
    this.setData({
      filterFlag: false
    })
  },
  // 隐藏筛选弹层
  hideFilter() {
    this.setData({
      filterFlag: true
    })
  },
  // 确认筛选条件
  sure(e) {
    this.setData({
      filterFlag: true
    })
  },
  // 点赞
  onZan(e) {
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
      list: this.data.lists
    })
  },
  // 获取列表数据
  getConnectList(){
    let username = wx.getStorageSync('username')
    listModel.connectInterview(username).then(res => {
      if(res.data.code == errorok){
        if(!res.data.data) res.data.data = []
        for (var index in res.data.data) {
          res.data.data[index].idcard = getAge(res.data.data[index].idcard)
          if (res.data.data[index].headimageurl != null) {
            res.data.data[index].headimageurl = this.data.globalimgeurl + res.data.data[index].headimageurl
          } else {
            res.data.data[index].headimageurl = '../../asset/img/avatar.png'
          }
        }
        this.setData({
          list: res.data.data
        })
      }
    })
  },
  // 获取列表数据
  getHousekeeperList: function () {
    var that = this
    var headers
    if (wx.getStorageSync('token')) {
      headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      }
    } else {
      headers = { 'content-type': 'application/x-www-form-urlencoded' }
    }
    wx.request({
      url: app.globalData.url + 'housekeeper/matchhousekeeperlist',
      method: 'POST',
      header: headers,
      data: {
        //product: 'EMPLOYER',
        pageindex: that.data.startpage,
        pagecount: that.data.pageCount,
        matchcount: 0
      },
      success: function (res) {
        if (res.data.data != undefined) {
          for (var index in res.data.data) {
            res.data.data[index].idcard = getAge(res.data.data[index].idcard)
            if (res.data.data[index].headimageurl != null) {
              res.data.data[index].headimageurl = that.data.globalimgeurl + res.data.data[index].headimageurl
            } else {
              res.data.data[index].headimageurl = '../../asset/img/avatar.png'
            }
          }
          var list = res.data.data;
          that.data.lists = that.data.lists.concat(list)
          that.setData({
            list: that.data.lists
          })
        } else {
          wx.showToast({
            title: '没有更多数据',
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
    this.getConnectList()

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
    this.data.startpage = 1
    this.data.lists = []
    this.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.startpage += 1
    this.getHousekeeperList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})