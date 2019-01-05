// pages/searchcard/searchcard.js
import { ListModel } from '../../models/list.js'
import { errorok } from '../../config.js'
const listModel = new ListModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { price: '2000', count: '20', value: 'v1', checked: 'true' },
      { price: '3000', count: '35', value: 'v2' },
    ],

    answerList: [],
    price: '2000'
  },
  /**
   * 事件处理函数
   */ 
  // radio事件
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let val = e.detail.value;
    this.data.items.forEach((item) => {
      if(item.value == val){
        this.setData({
          price: item.price
        })
      }
    })
    
  },
  // 购买
  buy(){
    wx.showModal({
      title: '提示',
      content: `支付金额：￥${this.data.price}`,
      confirmText: '去支付',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } 
      }
    })
  },
  // 根据类别获取need
  getNeedByClassic(ccid) {
    listModel.getNeedListByClassic(ccid).then(res => {
      if (res.data.code == errorok) {
        if (!res.data.data) { res.data.data = [] }
        this.setData({
          questions: res.data.data,
        })
      }
    })
  },
  // 获取题目数据
  getQuesList(){
    var that = this
    wx.request({
      url: app.globalData.url + 'exam/baseExamlist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.data != null) {
          if (res.data.data.length != 0) {
            that.setData({
              questions: res.data.data,
            })
          } else {
            wx.showToast({
              title: '暂无数据',
              icon: 'none',
              duration: 2000
            })

          }
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNeedByClassic(options.ccid)
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