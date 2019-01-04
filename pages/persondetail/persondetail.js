import {
  ListModel
} from '../../models/list.js'
import {
  errorok
} from '../../config.js'
import { getAge } from '../../utils/util.js'
const app = getApp()
const listModel = new ListModel()
Page({
  data: {
    hideFlag: undefined, // 发起面试按钮显示与否，1表示隐藏，0表示显示
    startpage: 1,
    pageCount: 1,
    tabsArr: ['基本信息', '获得证书', '征信信息', '性格信息'],
    // 雇主评论信息
    reviewArr: [],
    currentTab: 0, // 初始基本信息
    globalimgeurl: app.globalData.imgeurl,
    collectFlag: 0, // 收藏与否的状态
    count: 0, //剩余查询次数
    phoneText: '拨打电话', // 拨打电话按钮文字
    tapFlag: false, //拨打电话按钮是否可用，false不可用
    connectFlag: true, // 联系弹窗显示与否
  },
  /*
   * 点击视频简历
   */
  videoIntro() {

  },
  // 获取数据是否收藏过
  isCollect(hkid){
    let username = wx.getStorageSync('username')
    listModel.getCollectList(username,hkid).then(res => {
      if(res.data.code == errorok){
        console.log(res.data)
        if(res.data.data.length > 0){
          this.setData({
            collectFlag: 1
          })
        }
      }
    })
  },
  /*
   * 点击收藏按钮
   */
  collect() {
    this.data.collectFlag = this.data.collectFlag == 1 ? 0 : 1
    this.setData({
      collectFlag: this.data.collectFlag
    })
    let meUser = wx.getStorageSync('username')
    listModel.collectState(meUser, this.data.hkid, this.data.collectFlag)
      .then(res => {
        if (res.data.code == errorok) {
          wx.showToast({
            title: '操作成功',
          })
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          })
        }
      })
  },
  /*
   * 点击申请签约
   */
  apply() {
    let headimageurl = this.data.person.headimageurl
    let name = this.data.person.name
    let workdate = this.data.person.workdate
    let education = this.data.person.education
    let address1 = this.data.person.address1
    let idcard = this.data.person.idcard
    let brief = this.data.person.brief
    let isLike = this.data.person.isLike
    let likeCount = this.data.person.likeCount
    let hkid = this.data.person.hkid
    wx.navigateTo({
      url: '../apply/apply?headimageurl=' + headimageurl + '&name=' + name + '&workdate=' + workdate + '&idcard=' + idcard + '&education=' + education + '&address1=' + address1 + '&brief=' + brief + '&isLike=' + isLike + '&likeCount=' + likeCount + '&hkid=' + hkid,
    })
  },
  // 点击联系
  connect() {
    this.setData({
      connectFlag: false
    })
  },
  // 阻止冒泡
  stopBubble() {},
  // 点击关闭
  close() {
    this.setData({
      connectFlag: true
    })
  },
  // 点击拨打电话
  onPhone() {
    // if能够查看，初次点击后获取手机号，并且次数减一
    // 假设获取手机号为 13522154362
    if (this.data.tapFlag) {
      this.setData({
        phoneText: this.data.username
      })
      wx.makePhoneCall({
        phoneNumber: this.data.phoneText // 仅为示例，并非真实的电话号码
      })
    }
  },
  // 点击购买查询卡
  buyCard() {
    wx.navigateTo({
      url: '../searchcard/searchcard',
    })
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
    this.auth(e);
  },
  //获取用户基本信息
  auth: function(e) {
    var that = this
    wx.request({
      url: app.globalData.url + 'auth',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Token: wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.code == 200) {
          var data = res.data.data;
          if (data.name == null || data.idcard == null) {
            wx.showModal({
              title: '温馨提示',
              content: '您的信息还未填写完整，请填写完整后再发起面试。',
              confirmText: '去填写',
              success: function(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../editMyInfo/editMyInfo?idcard=' + data.idcard +
                      '&name=' + data.name +
                      '&address1=' + data.address1 +
                      '&address2=' + data.address2 +
                      '&address3=' + data.address3 +
                      '&education=' + data.education +
                      '&sex=' + data.sex +
                      '&username=' + data.username,
                  })
                }
              }
            })
          } else {
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
    this.data.username = options.username
    this.getHouseKeeperDetails(options.username)
    this.isCollect(options.hkid)
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
  getTestResult: function(hkid) {
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
      success: function(res) {

        if (res.data.data[0] == null) {
          that.setData({
            result: false,
          })
        } else {
          var obj = JSON.parse(res.data.data[0].result)
          that.setData({
            result: obj,
          })
        }


      },
    })
  },
  getTestResult2: function(hkid) {
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
      success: function(res) {

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
  getAuthData: function(hkid) {
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
      success: function(res) {
        if (res.data.data[0] != null) {
          that.setData({
            auth_time: res.data.data[0].auth_time,
            identity_auth: res.data.data[0].identity_auth,
            laolai_auth: res.data.data[0].laolai_auth,
            phonenumber_auth: res.data.data[0].phonenumber_auth
          })
        }

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
          //   res.data.data[index].idcard = getAge(res.data.data[index].idcard)
          // }
          that.data.hkid = res.data.data[0].hkid; // 获取hkid
          // that.data.collectFlag = res.data.data[0].flag; // 获取收藏状态
          res.data.data[0].age = getAge(res.data.data[0].idcard)
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
  
})