// component/filter/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    //人员类别
    classicArr: [
      { label: '保姆', value: 'c1' },
      { label: '月嫂', value: 'c2' },
      { label: '管家', value: 'c3' },
      { label: '育儿嫂', value: 'c4' },
      { label: '司机', value: 'c5' },
    ],
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

  /**
   * 组件的方法列表
   */
  methods: {
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
          res.push(item.value)
        }
      })
      this.data.classicArr.forEach((item) => {
        if (item.flag == true) {
          res.push(item.value)
        }
      })
      // 把筛选条件结果传递给主页面
      this.triggerEvent('sure', {
        val: res
      })
    },
  }
})
