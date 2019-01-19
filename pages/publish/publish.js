var app = getApp()

Page({
  data: {
    answerList: [],
    showFlag: false,
    x: null, // 单选答案
    y: [], //多谢答案
  },
  //点击确定 
  sure(e){
    if (e.detail.val.length == 0){
      wx.showToast({
        title: '请选择人员类别',
        icon: 'none'
      })
      return
    }
    this.data.ids = e.detail.val.join(',')
    wx.setStorageSync('ccid', this.data.ids)
    this.setData({
      showFlag: true
    })
    this.getQuesList()
  },
  /**
   * 选择答案
   */
  radioChange:function(e){
    this.setData({
      x: e.detail.value
    })
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
    this.setData({
      y: e.detail.value
    })
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
  submit: function(){
    wx.setStorageSync('userNeed', this.data.answerList)
    if (this.data.x || this.data.y.length) {
    // 提交成功跳转
      wx.navigateTo({
        url: '../match/match',
      })
    } else {
      wx.showToast({
        title: '请选择需求',
        icon: 'none'
      })
    }
    
  },
  // 获取题目
  getQuesList(){
    var that = this
    wx.request({
      url: app.globalData.url + 'exam/baseExamlist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      data: {
        ccid: this.data.ids
        //name: '试题1', //课程模块
        //ccid: 1, //课程名称
        //ismust: 1 //是否必学
      },
      success: function (res) {
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
    
    // this.getQuesList()
  }
})