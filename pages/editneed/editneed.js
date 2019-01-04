import { ListModel } from '../../models/list.js'
import { errorok } from '../../config.js'
const app = getApp()
const listModel = new ListModel()

Page({
  data: {
    answerList: []
  },
  /**
   * 选择答案
   */
  radioChange: function (e) {
    for (var i = 0; i < this.data.answerList.length; i++) {
      if (this.data.answerList[i].eid == e.currentTarget.dataset.eid) {
        this.data.answerList.splice(i, 1)
      }
    }
    var obj = {
      eid: e.currentTarget.dataset.eid,
      oid: e.detail.value
    }
    this.data.answerList.push(obj)
  },
  // 点击多选
  checkboxChange: function (e) {
    for (let i = 0; i < this.data.answerList.length; i++) {
      if (this.data.answerList[i].eid == e.currentTarget.dataset.eid) {
        this.data.answerList.splice(i, 1)
      }
    }
    var obj = {
      eid: e.currentTarget.dataset.eid,
      oid: (e.detail.value).join(',')
    }
    this.data.answerList.push(obj);
  },
  /**
   * 提交
   */
  submit: function () {
    wx.setStorageSync('userNeed', this.data.answerList)
    //console.log(JSON.stringify(wx.getStorageSync('userNeed')))
    // 提交成功跳转
    if (wx.getStorageSync('token')) {
      wx.request({
        url: app.globalData.url + 'exam/addresults',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Token': wx.getStorageSync('token')
        },
        data: {
          answer: JSON.stringify(wx.getStorageSync('userNeed')),
        },
        success: function (res) {

          if (res.data.code == 200) {
            wx.switchTab({
              url: '../index/index'
            })
            wx.showToast({
              title: '需求发布成功',
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  // 根据类别获取need
  getNeedByClassic(ccid){
    listModel.getNeedListByClassic(ccid).then(res => {
      if(res.data.code == errorok){
        if (!res.data.data) { res.data.data = []}
        this.setData({
          questions: res.data.data,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNeedByClassic(options.ccid)
  }
})