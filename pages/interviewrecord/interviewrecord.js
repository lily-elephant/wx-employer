// pages/interviewrecord/interviewrecord.js
var app = getApp()
Page({
  data: {
    lists: [],
    pageindex: 1,
    pagecount: 10,
    globalimgeurl: app.globalData.imgeurl
  },
  // 点击放弃
  giveUp: function(e){
    wx.navigateTo({
      url: '../giveup/giveup?interviewid=' + e.currentTarget.dataset.interviewid + '&index=' + e.currentTarget.dataset.index ,
    })
  },
  // 点击雇佣
  sure: function (e) {
    var that = this
    wx.request({
      url: app.globalData.url + 'order/sureInterview',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Token': wx.getStorageSync('token') },
      data: {
        interviewid: e.currentTarget.dataset.interviewid
      },
      success: function (res) {
        if (res.data.code == '200') {
          wx.showToast({
            title: '操作成功',
          })
          that.data.lists[e.currentTarget.dataset.index].result = '合同生成中'
          that.setData({
            records: that.data.lists
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  loadData:function(){
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
              res.data.data[index].age = that.getAges(res.data.data[index].hkidcard)
            }

            var list = res.data.data;
            that.data.lists = that.data.lists.concat(list)
            if (that.data.lists != null){
              that.setData({
                records: that.data.lists
              })
            }else{
              that.setData({
                records: []
              })
            }
          } else {
            wx.showToast({
              title: '没有更多数据',
            })
            if(that.data.pageindex==1){
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
  onShow:function(){
    var that = this 
    //from和index 在giveup页面赋值 判断是否有值存在更新
    if (wx.getStorageSync('from') && wx.getStorageSync('index') && wx.getStorageSync('from') == 'giveup'){
      var index = wx.getStorageSync('index')
      that.data.lists[index].result = '雇主放弃'
      that.setData({
        records: that.data.lists
      })
    }
    wx.removeStorageSync('from')
    wx.removeStorageSync('index')
  },
  onLoad: function () {
    wx.removeStorageSync('from')
    wx.removeStorageSync('index')
    this.loadData() ;
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
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    this.data.pageindex = 1
    this.data.lists = []
    this.loadData();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageindex += 1
    this.loadData();
  },
  gojump:function(e){
    var username = e.currentTarget.dataset.hkphone
    var hkid = e.currentTarget.dataset.hkid
    wx.navigateTo({
      url: '../persondetail/persondetail?username=' + username + "&hkid=" + hkid ,
    })
  }
})