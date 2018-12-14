var app = getApp()
Page({
  data: {
    answerList: []
  },
  /**
   * 选择答案
   */
  radioChange:function(e){
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
  submit: function(){
    //console.log(this.data.answerList)
    wx.setStorageSync('userNeed', this.data.answerList)
    // 提交成功跳转
    wx.navigateTo({
      url: '../match/match',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    wx.request({
      url: app.globalData.url + 'exam/baseExamlist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      data: {
        //name: '试题1', //课程模块
        //ccid: 1, //课程名称
        //ismust: 1 //是否必学
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.data != null){
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
        }else{
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }) 
  }
})