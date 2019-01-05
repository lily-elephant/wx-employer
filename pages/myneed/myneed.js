// pages/myneed/myneed.js
import { ListModel } from '../../models/list.js'
import { errorok } from '../../config.js'
const listModel = new ListModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },
  /**
   * 事件处理函数
   */ 
  // 编辑我的需求
  edit(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../searchcard/searchcard?ccid='+id,
    })
  },
  // 新增需求
  addNeed(){
    wx.navigateTo({
      url: '../publish/publish',
    })
  },
  // 获取我的需求
  getMyNeeds() {
    let username = wx.getStorageSync('username')
    listModel.getHasNeeds(username).then(res => {
      if (res.data.code == errorok) {
        if (!res.data.data) { res.data.data = [] }
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
    this.getMyNeeds()
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