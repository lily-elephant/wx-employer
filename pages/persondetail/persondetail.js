var app = getApp()
Page({
  data: {
    hideFlag: undefined, // 发起面试按钮显示与否，1表示隐藏，0表示显示
    startpage: 1,
    pageCount: 1,
    tabsArr: ['基本信息', '获得证书','征信信息','性格信息'],
    // 雇主评论信息
    reviewArr: [],
    currentTab: 0, // 初始基本信息
    globalimgeurl: app.globalData.imgeurl,
    collectFlag: false, // 收藏与否的状态
  },
  /*
  * 点击视频简历
  */
  videoIntro(){
    
  },
  /*
  * 点击收藏按钮
  */ 
  collect(){
    this.setData({
      collectFlag: !this.data.collectFlag
    })
  },
  /*
  * 点击申请签约
  */ 
  apply(){

  },



  // tab切换
  tabHandle: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  // 发起面试 code为0表示由人员详情进入的面试预约
  goInterview: function(e) {
    //获取当前用户个人信息，检测姓名，身份证是否为空。为空跳编辑个人信息页面
    this.auth(e) ;
  },
  //获取用户基本信息
  auth: function (e) {
    var that = this
    wx.request({
      url: app.globalData.url + 'auth',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 200) {
          var data = res.data.data ;
          if (data.name == null || data.idcard == null ){
            wx.showModal({
              title: '温馨提示',
              content: '您的信息还未填写完整，请填写完整后再发起面试。',
              confirmText:'去填写',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../editMyInfo/editMyInfo?idcard=' + data.idcard
                      + '&name=' + data.name
                      + '&address1=' + data.address1
                      + '&address2=' + data.address2
                      + '&address3=' + data.address3
                      + '&education=' + data.education
                      + '&sex=' + data.sex
                      + '&username=' + data.username,
                  })
                } 
              }
            })
          }else{
            wx.navigateTo({
              url: '../interview/interview?code=0&hkid=' + e.target.dataset.hkid,
            })
          }          
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(options)
    this.getHouseKeeperDetails(options.username)
    this.getComment(options.hkid)
    this.getCertificateList(options.hkid)
    this.getAuthData(options.hkid)
    //获取九型人格信息
    this.getTestResult(options.hkid)
    this.getTestResult2(options.hkid)
    //console.log(options)
    if (options.hide == 1) {
      this.setData({
        hideFlag: false,
      })
    } else {
      this.setData({
        hideFlag: true,
      })
    }
  },
  getTestResult:function(hkid){
    var that = this
    var headers = {
      'content-type': 'application/x-www-form-urlencoded'
    }
    wx.request({
      url: app.globalData.url + 'admin/getPersonalityAnswer',
      method: 'POST',
      header: headers,
      data: {
        hkid: hkid
      },
      success: function (res) {
        
        if (res.data.data[0] == null){
          that.setData({
            result: false,
          })
        }else {
          var obj = JSON.parse(res.data.data[0].result)
          that.setData({
            result: obj,
          })
        }
        
        
      },
    })
  },
  getTestResult2: function (hkid) {
    var that = this
    var headers = {
      'content-type': 'application/x-www-form-urlencoded'
    }
    wx.request({
      url: app.globalData.url + 'admin/getPersonalityAnswerTwo',
      method: 'POST',
      header: headers,
      data: {
        hkid: hkid
      },
      success: function (res) {

        if (res.data.data[0] == null) {
          that.setData({
            result2: false,
          })
        } else {
          var obj = JSON.parse(res.data.data[0].result)
          that.setData({
            result2: obj,
          })
        }
      },
    })
  },
  getAuthData:function(hkid){
    var that = this
    var headers = {
      'content-type': 'application/x-www-form-urlencoded'
    }
    wx.request({
      url: app.globalData.url + 'getAuthData',
      method: 'POST',
      header: headers,
      data: {
        hkid: hkid
      },
      success: function (res) {
        that.setData({
          auth_time: res.data.data[0].auth_time,
          identity_auth: res.data.data[0].identity_auth,
          laolai_auth: res.data.data[0].laolai_auth,
          phonenumber_auth: res.data.data[0].phonenumber_auth
        })
      },
    })
  },
  getCertificateList: function(hkid) {
    var that = this
    var headers = {
      'content-type': 'application/x-www-form-urlencoded'
    }
    wx.request({
      url: app.globalData.url + 'housekeeper/certificatelist',
      method: 'POST',
      header: headers,
      data: {
        hkid: hkid
      },
      success: function(res) {
        that.setData({
          certificatelist: res.data.data
        })
      },
    })
  },
  getComment: function(hkid) {
    var that = this
    var headers = {
      'content-type': 'application/x-www-form-urlencoded'
    }
    wx.request({
      url: app.globalData.url + 'housekeeper/comment',
      method: 'POST',
      header: headers,
      data: {
        hkid: hkid
      },
      success: function(res) {
        //console.log(res.data.data)
        // if (res.data.data != undefined) {
        // }
        that.setData({
          reviewArr: res.data.data
        })
      },
    })
  },
  getHouseKeeperDetails: function(username) {
    var that = this
    var headers
    if (wx.getStorageSync('token')) {
      headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      }
    } else {
      headers = {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
    wx.request({
      url: app.globalData.url + 'housekeeper/housekeeperlist',
      method: 'GET',
      header: headers,
      data: {
        currPage: that.data.startpage,
        pageSize: that.data.pageCount,
        username: username
      },
      success: function(res) {
        //console.log(res.data.data)
        if (res.data.data != undefined) {
          // for (var index in res.data.data) {
          //   res.data.data[index].idcard = that.getAges(res.data.data[index].idcard)
          // }
          res.data.data[0].age = that.getAges(res.data.data[0].idcard)
          if (res.data.data[0].servicestate != null) {
            res.data.data[0].servicestate = res.data.data[0].servicestate == 0 ? "找工作" : "在职"
          } else {
            res.data.data[0].servicestate = "未填写"
          }

          if (res.data.data[0].headimageurl != null) {
            res.data.data[0].headimageurl = that.data.globalimgeurl + res.data.data[0].headimageurl
          } else {
            res.data.data[0].headimageurl = '../../asset/img/avatar.png'
          }

          that.setData({
            person: res.data.data[0]
          })
        } else {
          wx.showToast({
            title: '没有更多数据',
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  getAges: function(identityCard) {
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
  }
})