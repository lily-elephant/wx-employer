// component/filter/index.js
import { ListModel } from '../../models/list.js'
import { errorok } from '../../config.js'
const listModel = new ListModel()

Component({
  externalClasses: ['por'],//可以传入多个class
  /**
   * 组件的属性列表
   */
  properties: {
    levelFlag: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //人员类别
    classicArr: [],
    // 认证级别
    levelArr: [
      { label: 'B1', value: 'l1' },
      { label: 'B2', value: 'l2' },
      { label: 'B3', value: 'l3' },
      { label: 'B4', value: 'l4' },
      { label: 'B5', value: 'l5' },
      { label: 'B6', value: 'l6' },
    ],
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      this._getClassicList();
    },
    moved() { },
    detached() { },
  },
  // 此处attached的声明会被lifetimes字段中的声明覆盖
  attached() { 
    console.log(2)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取人员类别列表
    _getClassicList() {
      listModel.getClassicList().then(res => {
        if (res.data.code == errorok){
          this.setData({
            classicArr: res.data.data
          })
        }
      })
    },
    // 阻止冒泡
    stopBubble(){},
    // 点击筛选条件人员类别
    onTap1(e) {
      let ev = e.currentTarget.dataset;
      this.data.classicArr.forEach((item, index) => {
        if (ev.idx == index) {
          item.flag = !item.flag
        }
      })
      this.setData({
        classicArr: this.data.classicArr
      })
    },
    // 点击筛选条件认证类别
    onTap2(e) {
      let ev = e.currentTarget.dataset;
      this.data.levelArr.forEach((item, index) => {
        if (ev.idx == index) {
          item.flag = !item.flag
        }
      })
      this.setData({
        levelArr: this.data.levelArr
      })
    },
    // 重置筛选条件
    reset() {
      this.data.levelArr.forEach((item) => {
        item.flag = false
      })
      this.data.classicArr.forEach((item) => {
        item.flag = false
      })
      this.setData({
        classicArr: this.data.classicArr,
        levelArr: this.data.levelArr
      })
    },
    // 确认筛选条件
    confirm() {
      let res = [];
      this.data.levelArr.forEach((item) => {
        if (item.flag == true) {
          // res.push(item.ccid)
        }
      })
      this.data.classicArr.forEach((item) => {
        if (item.flag == true) {
          res.push(item.ccid)
        }
      })
      // 把筛选条件结果传递给主页面
      this.triggerEvent('sure', {
        val: res
      })
    },
  }
})
