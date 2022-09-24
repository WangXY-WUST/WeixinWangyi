import config from './config'
// 封装ajax请求
export default (url , data = {} , method = 'GET') => {
  return new Promise((resolve , reject)=>{
    wx.request({
      url: config.host + url,
      method,
      data,
      // 获取video需要使用该接口，且头文件需要携带cookie，所以这里配置头文件，
      header:{
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
      },
      success: (res) => {
        resolve(res.data)
      },
      fail:(err)=>{
        reject(err)
      },
    })
  })
}