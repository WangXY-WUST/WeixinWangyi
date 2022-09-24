import config from './config'
/*
 * 封装ajax请求,由于登录接口出现问题，所以重新配置一个文件专门用来发送登录请求.
 * 登陆之后所有的请求都需要使用改接口
 * */
export default (url , data = {} , method = 'GET') => {
  return new Promise((resolve , reject)=>{
    wx.request({
      url: config.cloudHost + url,
      method,
      data,
      success: (res) => {
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      },
    })
  })
}