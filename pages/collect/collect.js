import { getAge } from '../../utils/util.js';
import { ListModel } from '../../models/list.js'
import { errorok } from '../../config.js'
const app = getApp()
const listModel = new ListModel()
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
  _getCollectList(){
    let username = wx.getStorageSync('username')
    listModel.getCollectList(username).then(res => {
      if(res.data.code == errorok){
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
    this._getCollectList()
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