import { config } from '../config.js'

class HTTP {
  // request(params) { // 为类添加方法，直接写方法名
  //   if(!params.method){
  //     params.method = 'GET'
  //   }
  //   wx.request({
  //     url: config.api_base_url + params.url,
  //     data: params.data,
  //     method: params.method,
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded', // post请求后端获取数据
  //       'Token': wx.getStorageSync('token')
  //     },
  //     success: (res)=> {
  //       let code = res.statusCode.toString()
  //       if (code.startsWith('2')){ // es6新方法startsWith endsWith
  //         params.success && params.success(res)
  //       }
  //     },
  //     fail: (err) => {
  //       wx.showToast({
  //         title: err
  //       })
  //     }
  //   })
  // }

  request({ url, data = {}, method = 'GET' }) {  // 对象解构
    return new Promise((resolve, reject) => { //new出来的Promise需要返回
      this._request(url, resolve, reject, data, method)
    })
  }
  _request(url, resolve, reject, data, method = 'GET') {
    wx.request({
      url: config.url + url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded', // post请求后端获取数据
        'Token': wx.getStorageSync('token')
      },
      success: (res) => {
        let code = res.statusCode.toString()
        if (code.startsWith('2')) { // es6新方法startsWith endsWith
          resolve(res)
        } else {
          reject //告诉promise状态改变不要一直进行中
        }
      },
      fail: (err) => {
        reject
        wx.showToast({
          title: err
        })
      }
    })
  }
}
export {
  HTTP
}