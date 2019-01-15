var app =  getApp()
Page({
  data: {
    name: '',
    idcard: '',
    username: '',
    age: '',
    sex:'',
    address1: '',
    address2: '',
    address3: '',
    education:'',
    imgUrl:''
  },
  // 家政需求
  goNeed: function(){
    wx.navigateTo({
      url: '../editneed/editneed',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.auth()
  },
  //获取用户基本信息 
  auth: function () {
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
          if (res.data.data.headimageurl != null) {
            that.data.imgUrl = app.globalData.imgeurl + res.data.data.headimageurl
          } else {
            that.data.imgUrl = '../../asset/img/logo.png'
          }
          that.data.age = that.getAges(res.data.data.idcard)
          that.setData({
            name: res.data.data.name,
            username: res.data.data.username,
            imgUrl: that.data.imgUrl,
            education: res.data.data.education,
            idcard: res.data.data.idcard,
            age:that.data.age,
            sex: res.data.data.sex,
            address1:res.data.data.address1,
            address2:res.data.data.address2,
            address3:res.data.data.address3,

            addresslabel: res.data.data.addresslabel,
            roomarea: res.data.data.roomarea,
            courtarea: res.data.data.courtarea,
            bedroom: res.data.data.bedroom,
            restaurant: res.data.data.restaurant,
            washroom: res.data.data.washroom,
            peoplecount: res.data.data.peoplecount,
            oldcount: res.data.data.oldcount,
            childcount: res.data.data.childcount,
            boycount: res.data.data.boycount,
            describes: res.data.data.describes

          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      }
    })
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
  goEdit:function(){
    wx.navigateTo({
      url: '../editMyInfo/editMyInfo?idcard=' + this.data.idcard
        + '&name=' + this.data.name
      + '&address1=' + this.data.address1
      + '&address2=' + this.data.address2
      + '&address3=' + this.data.address3
      + '&education=' + this.data.education
      + '&sex=' + this.data.sex
      + '&username=' + this.data.username
      + '&addresslabel=' + this.data.addresslabel
      + '&roomarea=' + this.data.roomarea
      + '&courtarea=' + this.data.courtarea
      + '&bedroom=' + this.data.bedroom
      + '&restaurant=' + this.data.restaurant
      + '&washroom=' + this.data.washroom
      + '&peoplecount=' + this.data.peoplecount
      + '&oldcount=' + this.data.oldcount
      + '&childcount=' + this.data.childcount
        + '&boycount=' + this.data.boycount
      + '&describes=' + this.data.describes,


    }) 
  }
})