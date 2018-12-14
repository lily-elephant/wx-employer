// pages/interview/interview.js
var app = getApp()
var dateTimePicker = require('../../utils/dateTimePicker.js');
var area = require('../../utils/area.js');
Page({
  data: {
    paymoney: 0, // 所需预约金
    //remaining: 1400, //钱包余额
    dateTimeArray1: null,
    dateTime1: null,
    startYear: new Date().getFullYear(), // 设置当前年份
    endYear: new Date().getFullYear()+10, // 设置截止年份
    provinceArray: [],
    cityArray: [],
    provinceIndex: 0,
    cityIndex: 0,
    flag: true, // 充值弹窗默认隐藏
    enoughFlag: false, // 余额不足默认隐藏
    resource: undefined, // 上一级页面code 0表示人员详情，1表示放弃的面试记录
    jsonName: '',
    // // 推荐的人员
    // recommend: {
    //   name: '张阿姨',
    //   experience: '36个月',
    //   degree: '中专',
    //   address: '黑龙江',
    //   desc: '做家务，全职带孩子',
    //   pay: 3500
    // }
    submitTime:'',
    submitDes: '',
    subPrivince:'',
    submitCity:[],
    subCity:'',
    hkid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getMoney:function(){
    var that = this 
    wx.request({
      url: app.globalData.url + 'getAppointMentMoney',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: function (res) {
        //console.log(res.data)
        if (res.data.code == '200' && res.data.data[0] != undefined ) {
          that.data.paymoney = res.data.data[0].appointmentMoney
          var money = res.data.data[0].appointmentMoney / 100
          that.setData({
            money: money
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
  onLoad: function (options) {
    this.getMoney()
    this.setData({
      resource: options.code //options为页面路由过程中传递的参数
    })
    if (this.data.resource == 0) {
      this.data.jsonName = '面试预约';
    } else {
      this.data.jsonName = '面试结果';
    }
    // 判断json应该显示的文字
    wx.setNavigationBarTitle({
      title: this.data.jsonName //页面标题为路由参数
    })
    // 时间获取
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    // 省级城市获取
    var provinceArrayDemo = []
    for (var i = 0; i < area.provinceArray.length; ++i) {
      var item = area.provinceArray[i]
      provinceArrayDemo.push(item.name)
    }
    this.setData({
      provinceArray: provinceArrayDemo,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
    //console.log(obj1.dateTimeArray)
    //options.hkid
    this.data.hkid = options.hkid
  },
  // 面试时间处理
  changeDateTime1(e) {
    this.setData({ 
      dateTime1: e.detail.value 
    });
    //console.log(e)
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });

    this.data.submitTime =
      dateArr[0][arr[0]] +
      '-' +
      dateArr[1][arr[1]] +
      '-' +
      dateArr[2][arr[2]] +
      ' ' +
      dateArr[3][arr[3]] +
      ':' +
      dateArr[4][arr[4]] 
  },
  //先取省份里面的 ProID
  bindProvinceChange: function (e) {
    for (var i = 0; i < area.provinceArray.length; ++i) {
      var item = area.provinceArray[i]
      if (i == e.detail.value) {
        this.ProID = item.ProID
        break
      }
    }
    this.cityArrayDemo = []
    //将城市里面里面的 ProID 组合在一起
    for (var i = 0; i < area.cityArray.length; ++i) {
      var item = area.cityArray[i]
      if (item.ProID == this.ProID) {
        this.cityArrayDemo.push(item.name)
      }
    }
    this.setData({
      provinceIndex: e.detail.value,
      cityArray: this.cityArrayDemo,
    })
    this.data.subPrivince = area.provinceArray[e.detail.value]
    // this.CityID = ''
    this.data.submitCity = this.cityArrayDemo 
  },
  bindCityChange: function (e) {
    //先取市里面的 ProID
    //  console.log(cityArray)
    for (var j = 0; j < area.cityArray.length; ++j) {
      var item = area.cityArray[j]
      if (item.name == this.cityArrayDemo[e.detail.value]) {
        this.CityID = item.CityID
        break
      }
    }
    //将城市里面里面的 ProID 组合在一起

    this.setData({
      cityIndex: e.detail.value,
      countyIndex: 0
    })
    //console.log(e.detail.value)
    this.data.subCity = this.data.submitCity[e.detail.value]
  },
  // textarea
  bindTextAreaBlur: function (e) {
    this.data.submitDes = e.detail.value
  },
  // 立即预约
  goAppoint: function(){
    if(wx.getStorageSync('token')){
      if (this.checkIsSubmit()){
        // 去支付 支付成功 添加提交 
        this.gopay();
      }
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  gopay:function(){
    var that = this 
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
                  money: that.data.paymoney,
                  productBrief: "支付预约金",
                  transactionid: '0',
                  businesstype: '预约金',
                  osid: '0',
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
                        title: '充值成功',
                      })
                      that.goSubmit() 
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
  goSubmit:function(){
    wx.request({
      url: app.globalData.url + 'order/addinterview',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' ,'Token':wx.getStorageSync('token')},
      data: {
        hkid: this.data.hkid,
        interviewtime: this.data.submitTime,
        place: this.data.subPrivince.name + this.data.subCity + this.data.submitDes,
        result:'尚未面试'
      },
      success: function (res) {
        //console.log(res)
        if(res.data.code == '200'){
          wx.navigateTo({
            url: '../meetsuccess/meetsuccess',
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }
      }
    })
  },
  checkIsSubmit:function(){
    if (this.data.submitTime == '' ){ 
      wx.showToast({
        title: '请选择面试时间',
        icon:"none"
      })
      return false ;
    }
    if (this.data.subPrivince.name == undefined) {
      wx.showToast({
        title: '请选择面试省份',
        icon: "none"
      })
      return false;
    }
    if (this.data.subCity == '') {
      wx.showToast({
        title: '请选择面试城市',
        icon: "none"
      })
      return false;
    }
    if (this.data.submitDes == '') {
      wx.showToast({
        title: '请输入面试详细地址',
        icon: "none"
      })
      return false;
    }
    return true ;
  },
})