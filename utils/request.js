import config from './config'
// 封装ajax请求
export default (url , data = {} , method = 'GET') => {
  return new Promise((resolve , reject)=>{
    wx.request({
      url: config.mobileHost + url,
      method,
      data,
      success: (res) => {
        resolve(res.data)
      },
      fail:(err)=>{
        reject(err)
      },
    })
  })
}