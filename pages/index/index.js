//index.js
import { getAge } from '../../utils/util.js';
import { ListModel } from '../../models/list.js'
import {errorok} from '../../config.js'
const app = getApp()
const listModel = new ListModel()

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
    captionNeed: '', //展示的需求文字
    optArr: [], //已有需求
    
  },
  /**
   * v2版本事件
   * */ 
  // 获取首页需求列表
  _getHasNeeds(username){
    listModel.getHasNeeds(username).then(res => {
      if(res.data.code == errorok){
        if(!res.data.data) {res.data.data = []}
        this.setData({
          optArr: res.data.data,
          captionNeed: res.data.data[0].name || ''
        })
      }
    })
  },
  // 获取权限username
  getNeeds() {
    if(wx.getStorageSync('token')){
      listModel.getAuth().then(res => {
        if (res.data.code == errorok) {
          wx.setStorageSync('username', res.data.data.username)
          let username = wx.getStorageSync('username')
          this._getHasNeeds(username);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      })
    }
  },
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
   // console.log(e)
    this.setData({
      filterFlag: true
    })
  },
  // 新增需求
  addNeed(){
    wx.navigateTo({
      url: '../publish/publish',
    })
  },
  // 点击具体需求
  tapNeed(e){
    let cap = e.currentTarget.dataset.cap;
    let ccid = e.currentTarget.dataset.id;
    this.setData({
      captionNeed: cap,
      needFlag: true
    })
    wx.navigateTo({
      url: '../editneed/editneed?ccid='+ccid,
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
  onDetail(e){
    let housekeep = e.detail.val;
    wx.navigateTo({
      url: '../persondetail/persondetail?username=' + housekeep.username + '&hkid=' + housekeep.hkid,
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
    this.getBanner()
  },
  getHousekeeperList:function(){
    var that = this
    var headers 
    if (wx.getStorageSync('token')){
      headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'Token':wx.getStorageSync('token')
      }
      wx.request({
        url: app.globalData.url + 'housekeeper/matchhousekeeperlist',
        method: 'POST',
        header: headers,
        data: {
          //product: 'EMPLOYER',
          pageindex: that.data.startpage,
          pagecount: that.data.pageCount,
          matchcount: 0
        },
        success: function (res) {
          //console.log(res.data.data[0])
          if (res.data.data != undefined) {
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
          } else {
            wx.showToast({
              title: '没有更多数据',
            })
          }
        },
        complete: function (res) {
          wx.stopPullDownRefresh();
        }
      })
    }else{
      wx.showToast({
        title: '请登录',
        icon: 'none'
      })
    }
    
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
      wx.redirectTo({
        url: '../knowledge/knowledge',
      })
      return
    }
    this.getNeeds(); // 获取我的需求
    //获取匹配的家政人员
    this.data.lists = []
    this.getHousekeeperList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.startpage = 1
    this.data.lists = []
    this.getHousekeeperList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.startpage += 1 
    this.getHousekeeperList()
  },
  
})
