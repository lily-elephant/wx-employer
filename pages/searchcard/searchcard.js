// pages/searchcard/searchcard.js
import { ListModel } from '../../models/list.js'
import { errorok } from '../../config.js'
const listModel = new ListModel()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { price: '2000', count: 20, value: 'v1', checked: 'true' },
      { price: '3000', count: 35, value: 'v2' },
    ],

    answerList: [],
    price: '2000',
    count: 20,
    ccid: null
  },
  /**
   * 事件处理函数
   */ 
  // radio事件
  radioChange(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    let val = e.detail.value;
    this.data.items.forEach((item) => {
      if(item.value == val){
        this.setData({
          price: item.price,
          count: item.count
        })
      }
    })
    
  },
  // 购买
  buy(){
    let that = this
    wx.showModal({
      title: '提示',
      content: `支付金额：￥${this.data.price}`,
      confirmText: '去支付',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          that.pay()
        } 
      }
    })
  },
  // 支付方法
  pay(){
    let that = this
    // 先获取openid
    wx.login({
      success: function (res) {
        // console.log(res, 's1')
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.url + 'wx/getopenid',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Token': wx.getStorageSync('token')
            },
            data: {
              code: res.code
            },
            success: function (res) {
              // console.log(res, 's2')
              var openid = res.data.openid;
              wx.request({
                url: app.globalData.url + 'wx/wxPay',
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Token': wx.getStorageSync('token')
                },
                data: {
                  openid: openid,
                  money: that.data.price * 100,
                  productBrief: "充值",
                  transactionid: that.data.count,
                  businesstype: 'V2_购买查询卡',
                  osid: that.data.ccid,
                },
                success: function (res) {
                  // console.log(res, 's3')
                  var data = res.data.data
                  //console.log(JSON.parse(res.data.data))
                  var orderNumber = res.data.ordernumber
                  wx.requestPayment({
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.package,
                    'signType': 'MD5',
                    'paySign': data.paySign,
                    'success': function (res) {
                      //console.log(res, 1111111111111);
                      wx.showToast({
                        title: '支付成功',
                      })
                      this.onLoad()
                    },
                    'fail': function (res) {
                      //console.log(res, 222222222);
                      wx.showToast({
                        title: '取消支付',
                        icon: null
                      })
                    }

                  });
                }
              })
            },
            fail: function (err) {
              // console.log(err)
            }
          })
        } else {
          // console.log('获取用户登录态失败！' + res.errMsg)
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
    this.setData({
      ccid: options.ccid
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