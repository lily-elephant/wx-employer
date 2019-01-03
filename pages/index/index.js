//index.js
import { getAge } from '../../utils/util.js';
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
    globalimgeurl: app.globalData.imgeurl,
    filterFlag: true, // 筛选条件显示与否
    needFlag: true, // 需求下拉显示与否
    captionNeed: '需求1', //展示的需求文字
    optArr: [
      { label: '需求1', value: 'n1' },
      { label: '需求2', value: 'n1' },      
    ], //已有需求
    
  },
  /**
   * v2版本事件
   * */ 
  // 点击筛选
  filter(){
    this.setData({
      filterFlag: false
    })
  },
  // 隐藏筛选弹层
  hideFilter(){
    this.setData({
      filterFlag: true
    })
  },
  // 确认筛选条件
  sure(e){
    console.log(e)
    this.setData({
      filterFlag: true
    })
  },
  // 新增需求
  addNeed(){
    
  },
  // 点击具体需求
  tapNeed(e){
    let cap = e.currentTarget.dataset.cap;
    this.setData({
      captionNeed: cap,
      needFlag: true
    })
  },
  // 点击需求文字
  needToggle(){
    this.setData({
      needFlag: !this.data.needFlag
    })
  },
  // 点赞
  onZan(e){
    console.log(e)
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
  
})
