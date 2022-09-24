// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    // 把音乐播放提升到全局属性，不然音乐在播放，但是返回去选歌，再进来同一个音乐，音乐在放，但是页面显示的却是暂停。所以我们全局声明一个是否播放的属性，当再次进去页面，音乐在播放且是同一首歌，就把局部的那个控制页面显示的isPlay也置为true
    isMusicPlay:false,
    musicPlayId:''
  }
})
