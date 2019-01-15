// pages/apply/apply.js
import { getAge } from '../../utils/util.js'
import { ListModel } from '../../models/list.js'
import { errorok } from '../../config.js'
const listModel = new ListModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signer: {}, // 签约人信息
    agree: 'agree', // 同意的值
    val: ['agree'], // 值
  },
  /**
   * 事件处理函数
   * **/
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
  // 点击CheckBox
  check(e){
    this.setData({
      val: e.detail.value
    })
  },
  // 申请签约
  apply(){
    if(this.data.val.length>0){
      let username = wx.getStorageSync('username')
      listModel.apply(username, this.data.signer.hkid).then(res => {
        if(res.data.code == errorok){
          wx.showModal({
            title: '提示',
            content: '客服人员将为您准备合同，请保持电话通畅',
            confirmText: '了解',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../sign/sign',
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '操作失败，请重试',
            icon: 'none'
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.idcard = getAge(options.idcard)
    this.setData({
      signer: options
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