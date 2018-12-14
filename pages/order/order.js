var app = getApp()
Page({
  data: {
    tabsArr: ['待支付', '已支付', '合同记录'],
    currentTab: 0,
    currentIdx: undefined, //默认点亮星星个数
    stars: [0, 1, 2, 3, 4],
    flag: true, // 默认评价碳层隐藏
    // 待支付订单
    orderWaiting: [],
    // 已完成订单
    orderFinished: [],
    // 雇佣记录
    employRecord: [],
    hkid:'',
    startCount:'',
    content:'',
    globalimgeurl: app.globalData.imgeurl
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取订单信息
    this.getOrderList(this.data.currentTab)
  },
  gojump:function(e){
    console.log()
    var username = e.currentTarget.dataset.hkphone 
    var hkid = e.currentTarget.dataset.hkid 
    wx.navigateTo({
      url: '../persondetail/persondetail?username=' + username + "&hkid=" + hkid ,
    })
  },
  //获取订单信息
  getEmployerRecord:function(){
    var that = this
    wx.request({
      url: app.globalData.url + 'getRecord',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Token: wx.getStorageSync('token')
      },
      success: function (res) {
        for (var i = 0; i <res.data.data.length ; i++){
          res.data.data[i].create_time = res.data.data[i].create_time.substring(0, res.data.data[i].create_time.length - 2)
        }
        //console.log(res.data.data)
        if (res.data.code == 200) {
          that.setData({
            employRecord: res.data.data
          })
        }
      }
    })
  },
  getOrderList: function (currentTab){
    if (currentTab!=2){
      var that = this
      wx.request({
        url: app.globalData.url + 'myOrder',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          Token: wx.getStorageSync('token')
        },
        data: {
          payflag: currentTab
        },
        success: function (res) {
          //console.log(res.data.data)
          if (res.data.code == 200) {
            if (currentTab == 0){
              that.setData({
                orderWaiting: res.data.data
              })
            } else if (currentTab == 1){
              that.setData({
                orderFinished: res.data.data
              })
            }
          }
        }
      })
    }else{
      this.getEmployerRecord()
    }
  },
  // textarea取值
  bindTextAreaBlur: function (e) {
    //console.log()
    this.data.content = e.detail.value
  },
  // 点击评价
  reviewTap: function(e){
    //console.log()
    this.data.hkid = e.currentTarget.dataset.hkid 
    this.setData({
      flag: false   
    })
  },
  // 点击星星,根据星星个数，加上中文满意程度
  starTap: function(e){
    this.data.startCount = e.currentTarget.dataset.idx
    this.setData({
      currentIdx: e.currentTarget.dataset.idx
    })
  },
  // 点击取消
  cancelTap: function(){
    this.setData({
      flag: true,
      currentIdx: -1
    })
    //console.log(this.data.currentIdx)
  },
  // 点击tab切换
  tabHandle: function (e) {
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: idx
    })
    //获取订单信息
    this.getOrderList(this.data.currentTab)
  },
  //去支付
  gopay:function(e){
    //console.log(e.currentTarget.dataset.osid)
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.url + 'getopenid',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Token': wx.getStorageSync('token')
            },
            data: {
              code: res.code
            },
            success: function (res) {
              var openid = res.data.openid;
              wx.request({
                url: app.globalData.url + 'wxPay',
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Token': wx.getStorageSync('token')
                },
                data: {
                  openid: openid,
                  money: e.currentTarget.dataset.money * 100 ,
                  productBrief: "支付平台管理费",
                  transactionid: '0',
                  businesstype: '薪水',
                  osid: e.currentTarget.dataset.osid,
                  billid: e.currentTarget.dataset.billid 
                },
                success: function (res) {
                  console.log(res.data.data)
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
              console.log(err)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  //提交评价
  submit:function(){
    var that = this
    wx.request({
      url: app.globalData.url + 'submitComment',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Token: wx.getStorageSync('token')
      },
      data: {
        hkid: that.data.hkid,
        score: that.data.startCount + 1,
        content: that.data.content
      },
      success: function (res) {
        //console.log(res.data.code == 200)
        if (res.data.code == 200){
          wx.showToast({
            title: '评价成功，请退出后刷新页面',
          })
          that.setData({
            flag: true,
            currentIdx: -1
          })
        }
      }
    })
  }
})