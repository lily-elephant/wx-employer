// component/housekeep/index.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    housekeep: Object,
    index: Number,
    zanFlag: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //事件处理函数
    dianZan() {
      if (wx.getStorageSync('token')) {
        let index = this.properties.index;
        let hkid = this.properties.housekeep.hkid;
        let that = this
        wx.request({
          url: app.globalData.url + 'source/getlike',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Token': wx.getStorageSync('token')
          },
          data: {
            hkid: hkid
          },
          success: function (res) {
            that.triggerEvent('zan', { 
              message: res.data.message,
              index: index
            })
          },
        })
      } else {
        wx.navigateTo({
          url: '../login/login',
        })
      }
    },
  }
})
