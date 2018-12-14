const app = getApp();
var util = require("../../utils/util.js");
var area = require('../../utils/area.js');
Page({
  data: {
    name:'',
    idcard:'',
    sex:'',
    address1: '',
    address2: '',
    address3: '',
    education: '',
    addresslabel:'',
    roomarea:'',
    courtarea:'',
    bedroom:'',
    restaurant:'',
    washroom:'',
    peoplecount:'',
    oldcount:'',
    childcount:'',
    boycount: '',
    describes:'',
    stand_name:'',
    stand_idcard: '',
    stand_sex: '',
    stand_address1: '',
    stand_address2: '',
    stand_address3: '',
    stand_education: '',
    stand_addresslabel: '',
    stand_roomarea: '',
    stand_courtarea: '',
    stand_bedroom: '',
    stand_restaurant: '',
    stand_washroom: '',
    stand_peoplecount: '',
    stand_oldcount: '',
    stand_childcount: '',
    stand_boycount: '',
    stand_describes: '',
    username:'',

    provinceArray: [],
    cityArray: [],
    provinceIndex: 0,
    cityIndex: 0,

    sexArray: ['男', '女'],
    sexIndex: 0,
    eduArray: ['小学', '初中', '高中', '大专', '中专', '本科', '研究生', '博士', '博士后'],
    eduIndex: 0,
    region: [],

    addArray: ['公寓', '独栋别墅','联排别墅'],
    addIndex:0,

    roomArray: ['300平以下', '300-500平', '500-800平','800-1000平' , '1000平以上'],
    roomIndex: 0,

    courtArray: ['300平以下', '300-500平', '500-800平', '800-1000平', '1000平以上'],
    courtIndex: 0,

    bedArray: ['1个', '2个', '3个','4个', '5个', '5个以上'],
    bedIndex: 0,

    resArray: ['1个', '2个', '3个', '4个', '5个', '5个以上'],
    resIndex: 0,

    washArray: ['1个', '2个', '3个', '4个', '5个', '5个以上'],
    washIndex: 0,

    peopleArray: ['1个', '2个', '3个', '4个', '5个', '6个' , '6个以上'],
    peopleIndex: 0,

    oldArray: ['1个', '2个', '3个', '4个', '4个以上'],
    oldIndex: 0,

    childArray: ['1个', '2个', '3个', '4个','4个以上'],
    childIndex: 0,

    boyArray: ['1个', '2个', '3个', '4个', '4个以上'],
    boyIndex: 0,

  },
  //region
  bindRegionChange:function(e){
    var add = e.detail.value;
    this.data.address1 = add[0]
    this.data.address2 = add[1] + add[2]
    this.setData({
      address1: this.data.address1,
      address2: this.data.address2
    })
  },
  // sex
  bindPickerChange: function (e) {
    let idx = e.detail.value;
    this.setData({
      sex: this.data.sexArray[idx],
      sexIndex: e.detail.value
    })
  },
  //education
  bindchangeEducation: function (e) {
    let ids = e.detail.value;
    this.setData({
      education: this.data.eduArray[ids],
      eduIndex: e.detail.value
    })
  },

  bindchangeadd: function (e) {
    let ids = e.detail.value;
    this.setData({
      addresslabel: this.data.addArray[ids],
      addIndex: e.detail.value
    })
  },

  bindchangeroom: function (e) {
    let ids = e.detail.value;
    this.setData({
      roomarea: this.data.roomArray[ids],
      roomIndex: e.detail.value
    })
  },

  bindchangecourt: function (e) {
    let ids = e.detail.value;
    this.setData({
      courtarea: this.data.courtArray[ids],
      courtIndex: e.detail.value
    })
  },

  bindchangebed: function (e) {
    let ids = e.detail.value;
    this.setData({
      bedroom: this.data.bedArray[ids],
      bedIndex: e.detail.value
    })
  },

  bindchangeres: function (e) {
    let ids = e.detail.value;
    this.setData({
      restaurant: this.data.resArray[ids],
      resIndex: e.detail.value
    })
  },

  bindchangewash: function (e) {
    let ids = e.detail.value;
    this.setData({
      washroom: this.data.washArray[ids],
      washIndex: e.detail.value
    })
  },

  bindchangepeople: function (e) {
    let ids = e.detail.value;
    this.setData({
      peoplecount: this.data.peopleArray[ids],
      peopleIndex: e.detail.value
    })
  },

  bindchangeold: function (e) {
    let ids = e.detail.value;
    this.setData({
      oldcount: this.data.oldArray[ids],
      oldIndex: e.detail.value
    })
  },

  bindchangechild: function (e) {
    let ids = e.detail.value;
    this.setData({
      childcount: this.data.childArray[ids],
      childIndex: e.detail.value
    })
  },

  bindchangeboy: function (e) {
    let ids = e.detail.value;
    this.setData({
      boycount: this.data.boyArray[ids],
      boyIndex: e.detail.value
    })
  },


  listenernameInput: function (e) {
    this.data.name = e.detail.value;

  },
  listenerdesInput: function (e) {
    this.data.describes = e.detail.value;

  },
  listeneriscardInput: function (e) {
    this.data.idcard = e.detail.value;

  },
  listenerSexInput: function (e) {
    this.data.sex = e.detail.value;

  },
  listenerAddressInput: function (e) {
    this.data.address3 = e.detail.value;

  },
  listenerEducationInput: function (e) {
    this.data.education = e.detail.value;

  },

  listeneraddressInput: function (e) {
    this.data.addresslabel = e.detail.value;

  },

  listenerroomInput: function (e) {
    this.data.roomarea = e.detail.value;

  },

  listenercourtInput: function (e) {
    this.data.courtarea = e.detail.value;

  },

  listenerbedInput: function (e) {
    this.data.bedroom = e.detail.value;

  },

  listenerresInput: function (e) {
    this.data.restaurant = e.detail.value;

  },

  listenerwashInput: function (e) {
    this.data.washroom = e.detail.value;

  },

  listenerpeopleInput: function (e) {
    this.data.peoplecount = e.detail.value;

  },

  listeneroldInput: function (e) {
    this.data.oldcount = e.detail.value;

  },

  listenerchildInput: function (e) {
    this.data.childcount = e.detail.value;

  },

  listenerboyInput: function (e) {
    this.data.boycount = e.detail.value;

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
  onLoad:function(options){
    //console.log(options)


    // 省级城市获取
    var provinceArrayDemo = []
    for (var i = 0; i < area.provinceArray.length; ++i) {
      var item = area.provinceArray[i]
      provinceArrayDemo.push(item.name)
    }
    this.setData({
      provinceArray: provinceArrayDemo,
      
    });
    var that = this 
    that.data.stand_name = options.name,
    that.data.stand_idcard = options.idcard,
    that.data.stand_sex = options.sex,
    that.data.stand_address1 = options.address1,
    that.data.stand_address2 = options.address2,
    that.data.stand_address3 = options.address3,
    that.data.stand_education = options.education,

      that.data.stand_addresslabel = options.addresslabel,
      that.data.stand_roomarea = options.roomarea,
      that.data.stand_courtarea = options.courtarea,
      that.data.stand_bedroom = options.bedroom,
      that.data.stand_restaurant = options.restaurant,
      that.data.stand_washroom = options.washroom,
      that.data.stand_peoplecount = options.peoplecount,
      that.data.stand_oldcount = options.oldcount,
      that.data.stand_childcount = options.childcount,
      that.data.stand_boycount = options.boycount,
      that.data.stand_describes = options.describes,

    that.data.username = options.username
    that.setData({
      name: options.name,
      idcard: options.idcard,
      sex: options.sex,
      address1: options.address1,
      address2: options.address2,
      address3: options.address3,
      education: options.education,
      addresslabel : options.addresslabel,
      roomarea : options.roomarea,
      courtarea : options.courtarea,
      bedroom : options.bedroom,
      restaurant : options.restaurant,
      washroom : options.washroom,
      peoplecount : options.peoplecount,
      oldcount : options.oldcount,
      childcount : options.childcount,
      boycount: options.boycount,
      describes: options.describes

    })
  },
  reset:function(){
    var that = this
    that.setData({
      name: that.data.stand_name,
      idcard: that.data.stand_idcard,
      sex: that.data.stand_sex,
      address1: that.data.stand_address1,
      address2: that.data.stand_address2,
      address3: that.data.stand_address3,
      education: that.data.stand_education,

      addresslabel : that.data.stand_addresslabel,
      roomarea : that.data.stand_roomarea,
      courtarea : that.data.stand_courtarea,
      bedroom : that.data.stand_bedroom,
      restaurant : that.data.stand_restaurant,
      washroom : that.data.stand_washroom,
      peoplecount : that.data.stand_peoplecount,
      oldcount : that.data.stand_oldcount,
      childcount : that.data.stand_childcount,
      boycount: that.data.stand_boycount,
      describes:that.data.stand_describes

    })
  },
  isSubmit(){
    var that = this 
    if (that.data.name == '' || that.data.name == null || that.data.name == "null") {
      wx.showToast({
        title: '请填写姓名',
      })
      return false;
    }
    if (that.data.idcard == '' || that.data.idcard == null || that.data.idcard == "null"){
      wx.showToast({
        title: '请填写身份证号',
      })
      return false ;
    }
    if (that.data.sex == '' || that.data.sex == null || that.data.sex == "null") {
      wx.showToast({
        title: '请填写性别',
      })
      return false;
    }
    if (that.data.address3 == '' || that.data.address3 == null || that.data.address3 == "null") {
      wx.showToast({
        title: '请填写籍贯',
      })
      return false;
    }
    // if (that.data.education == '' || that.data.education == null || that.data.education == "null") {
    //   wx.showToast({
    //     title: '请填写最高学历',
    //   })
    //   return false;
    // }
    return true ;
  },
  lodaData(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'editEmployerInfo',  //不用判断token
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      data: {
        username:that.data.username,
        name: that.data.name,
        idcard: that.data.idcard,
        sex: that.data.sex,
        address1: that.data.address1,
        address2: that.data.address2,
        address3: that.data.address3,
        //education: that.data.education,
        addresslabel : that.data.addresslabel,
        roomarea : that.data.roomarea,
        courtarea : that.data.courtarea,
        bedroom : that.data.bedroom,
        restaurant : that.data.restaurant,
        washroom : that.data.washroom,
        peoplecount : that.data.peoplecount,
        oldcount : that.data.oldcount,
        childcount : that.data.childcount,
        boycount: that.data.boycount,
        describes: that.data.describes
      },
      success: function (res) {
        //console.log(res)
        if(res.data.code == '200'){
          wx.showToast({
            title: '保存成功',
          })
          wx.navigateBack({
            delta:1
          })
        }else{
          wx.showToast({
            title: '保存失败',
          })
        }
      }
    }) 
  },
  submit: function () {
    if (this.isSubmit()){
      this.lodaData();
    }
  },
  
})