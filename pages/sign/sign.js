// pages/sign/sign.js
import { ListModel } from '../../models/list.js'
import { errorok } from '../../config.js'
import { getAge } from '../../utils/util.js';
const app = getApp();
const listModel = new ListModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [], 
    pageindex: 1,
    pagecount: 10,
    globalimgeurl: app.globalData.imgeurl,
  },

  //事件处理函数
  // 点赞
  onZan(e) {
    // ps：面试列表接口暂无点赞字段2019/01/03/23:23
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
      records: this.data.lists
    })
  },
  // 点击已签约
  signed(e){
    let person = e.currentTarget.dataset.item
    let headimageurl = person.headimageurl
    let name = person.name
    let workdate = person.workdate
    let education = person.education
    let address1 = person.address1
    let idcard = person.idcard
    let brief = person.brief
    let isLike = person.isLike
    let likeCount = person.likeCount
    let hkid = person.hkid
    let sDate = person.sign_startdate
    let eDate = person.sign_enddate
    let job = person.sign_job
    let salary = person.sign_salary
    let downloadurl = person.sign_downloadurl
    wx.navigateTo({
      url: '../signed/signed?headimageurl=' + headimageurl + '&name=' + name + '&workdate=' + workdate + '&idcard=' + idcard + '&education=' + education + '&address1=' + address1 + '&brief=' + brief + '&hkid=' + hkid + '&sdate=' + sDate + '&edate=' + eDate + '&job=' + job + '&salary=' + salary + '&downloadurl=' + downloadurl,
    })
  },
  onDetail(e) {
    let housekeep = e.detail.val;
    wx.navigateTo({
      url: '../persondetail/persondetail?username=' + housekeep.username + '&hkid=' + housekeep.hkid,
    })
  },
  // 获取已签约列表
  _getSignList(){
    let username = wx.getStorageSync('username')
    listModel.getSignList(username, null).then(res => {
      if(res.data.code == errorok) {
        if(!res.data.data){res.data.data=[]}
        for (var index in res.data.data) {
          res.data.data[index].idcard = getAge(res.data.data[index].idcard)
          if (res.data.data[index].headimageurl != null) {
            res.data.data[index].headimageurl = this.data.globalimgeurl + res.data.data[index].headimageurl
          } else {
            res.data.data[index].headimageurl = '../../asset/img/avatar.png'
          }
        }
        this.setData({
          records: res.data.data
        })
      }
    })
  },
  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this._getSignList()
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
    this.data.pageindex = 1
    this.data.lists = []
    this.getSignList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageindex += 1
    this.getSignList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // getAges: function (identityCard) {
  //   var len = (identityCard + "").length;
  //   if (len == 0) {
  //     return 0;
  //   } else {
  //     if ((len != 15) && (len != 18)) {
  //       return 0;
  //     }
  //   }
  //   var strBirthday = "";
  //   if (len == 18) {
  //     strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
  //   }
  //   if (len == 15) {
  //     strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
  //   }
  //   //时间字符串里，必须是“/”
  //   var birthDate = new Date(strBirthday);
  //   var nowDateTime = new Date();
  //   var age = nowDateTime.getFullYear() - birthDate.getFullYear();
  //   //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  //   if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   return age;
  // }
})