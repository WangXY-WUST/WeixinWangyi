import request from '../../utils/request';
import login from '../../utils/login'
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 手机号和密码的输出处理函数
  handleInput(event) {
  let name = event.currentTarget.id
  let value = event.detail.value
  this.setData({
    [name]:value
  })
  },
  // 点击登录前端验证
  async login() {
    let {phone , password} = this.data
    // 判断手机号是为空
    if(!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon:'none'
      })
      return
    }
    // 判断手机号是否合法
    let Re = /^1[3-9]\d{9}$/
    if(!Re.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon:'none'
      })
      return
    }
    // 判断密码是否为空
    if(!password) {
      wx.showToast({
        title: '密码不能为空',
        icon:'none'
      })
      return 
    }
    // 验证用户名，密码
    let res = await login('/login/cellphone' , {phone , password})
    let result = res.data
    if(result.code === 200){
      wx.showToast({
        title: '登录成功',
      })
      // 存储cookie
      wx.setStorageSync('cookies', res.cookies)
      // 将个人信息存储到本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      // 成功后跳转到我的
      wx.switchTab({
        url: '/pages/my/my',
      })
    }
    else if(result.code === 400) {
      wx.showToast({
        title: '手机号错误',
        icon:'none'
      })
  
    }
    else if(result.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon:'none'
      })
 
    }
    else {
      wx.showToast({
        title: '登陆失败,请重新登录',
        icon:"none"
      })
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})