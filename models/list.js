import { HTTP } from '../utils/http.js'

class ListModel extends HTTP { // 类，需要new以后去使用
  // 获取人员类别列表
  getClassicList() {
    return this.request({
      url: 'exam/baseExamCatagory',
      data: {},
      method: 'POST'
    })
  }
  // 获取已有的需求列表
  getHasNeeds(username) {
    return this.request({
      url: 'exam/baseMyExamCatagory',
      data: {
        username: username
      },
      method: 'POST'
    })
  }
  // 获取个人auth
  getAuth(){
    return this.request({
      url: 'auth',
      data: {},
      method: 'POST'
    })
  }
  // 根据类别获取need需求
  getNeedListByClassic(ccid){
    return this.request({
      url: 'exam/baseExamlist',
      data: {
        ccid: ccid
      },
      method: 'POST'
    })
  }
  // 收藏状态
  collectState(username, hkid, flag){
    return this.request({
      url: 'employer/star',
      data: {
        username: username,
        hkid: hkid,
        flag: flag
      },
      method: 'POST'
    })
  }
  // 获取签约列表
  getSignList(username){
    return this.request({
      url: 'employer/signlist',
      data: {
        username: username
      },
      method: 'POST'
    })
  }
  // 获取是否签约
  getIsSigned(username, hkid) {
    return this.request({
      url: 'employer/signlist',
      data: {
        username: username,
        hkid: hkid
      },
      method: 'POST'
    })
  }
  // 申请签约
  apply(username, hkid){
    return this.request({
      url: 'employer/sign',
      data: {
        username: username,
        hkid: hkid
      },
      method: 'POST'
    })
  }
  // 获取收藏数据
  getCollectList(username, hkid){
    return this.request({
      url: 'employer/starList',
      data: {
        username: username,
        hkid: hkid||''
      },
      method: 'POST'
    })
  }
  // 联系面试 && 我联系的数据列表
  connectInterview(username, hkid){
    return this.request({
      url: 'employer/contractList',
      data: {
        username: username,
        hkid: hkid || ''
      },
      method: 'POST'
    })
  }
  // 联系面试面板api
  interviewCard(username, ccid) {
    return this.request({
      url: 'employer/viewcard',
      data: {
        username: username,
        ccid: ccid
      },
      method: 'POST'
    })
  }
  // 拨打电话
  tapPhone(username, hkid, ccid) {
    return this.request({
      url: 'employer/contract',
      data: {
        username: username,
        hkid: hkid,
        ccid: ccid
      },
      method: 'POST'
    })
  }
  // 获取价钱和次数
  getPriceAndCount(ccid){
    return this.request({
      url: 'employer/viewcardpricebyccid',
      data: {
        ccid: ccid
      },
      method: 'POST'
    })
  }
}

export {
  ListModel
}