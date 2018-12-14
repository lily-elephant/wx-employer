//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //imgUrls: [],
    indicatorDots: true, // 显示指示点
    autoplay: true, // 自动切换
    interval: 5000, // 切换时间间隔
    duration: 500, // 滑动动画时长
    lists: [],
    startpage:1,
    pageCount:10,
    globalimgeurl: app.globalData.imgeurl

  },
  //事件处理函数
  dianZan: function(e){
    if(wx.getStorageSync('token')){
      var index = e.currentTarget.dataset.idx;
      var hkid = e.currentTarget.dataset.hkid;
      var that = this
      wx.request({
        url: app.globalData.url + 'source/getlike',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Token': wx.getStorageSync('token')
        },
        data: {
          hkid: hkid
        },
        success: function (res) {
          //console.log(res.data.message)
          if (res.data.message == '点赞成功'){
            that.data.lists[index].isLike = '1'
            var j = parseInt(that.data.lists[index].likeCount);
            that.data.lists[index].likeCount = j + 1
          } else if (res.data.message == '取消点赞成功'){
            that.data.lists[index].isLike = '0'
            var j = parseInt(that.data.lists[index].likeCount);
            that.data.lists[index].likeCount = j - 1
          }
          that.setData({
            list: that.data.lists
          })
        },
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }   
  },
  /**
   * 修改需求，state为1修改需求提交后进入首页
   */ 
  change:function(){
    // 提交成功跳转
    // wx.navigateTo({
    //   url: '../editneed/editneed?state=1'
    // })
    wx.navigateTo({
      url: '../editneed/editneed',
    })
  },
  onLoad: function () {
    //获取banner
    this.getBanner()
    //获取匹配的家政人员
    this.getHousekeeperList()
  },
  getHousekeeperList:function(){
    var that = this
    var headers 
    if (wx.getStorageSync('token')){
      headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'Token':wx.getStorageSync('token')
      }
    }else{
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
        matchcount:0
      },
      success: function (res) {
        //console.log(res.data.data[0])
        if (res.data.data != undefined){
          for (var index in res.data.data) {
            res.data.data[index].idcard = that.getAges(res.data.data[index].idcard)
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
        }else{
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
  getBanner:function(){
    var that = this 
    wx.request({
      url: app.globalData.url + 'source/bannerlist',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        product: 'EMPLOYER',
        pageindex: 1,
        pagecount: 3
      },
      success: function (res) {
        //console.log(res.data.data) 
        var _imgUrls = [];
        if (res.data.data != undefined) {
          // var data = res.data.data;
          // var len = data.length;
          // for (var i = 0; i < len; i++) {
          //   _imgUrls[i] = data[i]["picture"];
          // }
          that.setData({
            bannerList: res.data.data
          })
        } else {
          that.setData({
            imgUrls: [
              '../../asset/img/banner1.jpg'
            ]
          })
        }
      }
    })
  },
  jump:function(e){
    if (e.currentTarget.dataset.data != null ){
      wx.navigateTo({
        url: '../bannerDes/bannerDes?pic=' + e.currentTarget.dataset.data.picture + '&article=' + e.currentTarget.dataset.data.article ,
      })
    }
    //console.log(e.currentTarget.dataset.data)
  },
  onShow: function () {
    if(!wx.getStorageSync('isSee')){
        // wx.navigateTo({
        //   url: '../knowledge/knowledge',
        // })
        wx.redirectTo({
          url: '../knowledge/knowledge',
        })
    }
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
  getAges: function (identityCard){
    var len = (identityCard + "").length;
    if(len == 0) {
      return 0;
    } else {
      if((len != 15) && (len != 18)){
        return 0;
      }
    }
    var strBirthday = "";
    if (len == 18){
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
  }
})
