import login from '../../utils/login'
let startY = 0
let endY = 0
let distance = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transform:'translateY(0rpx)',
    // 位移动画效果
    transition:"",
    // 存储用户信息
    userInfo:{},
    // 存储用户最近播放记录
    recentMusicList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载时，查看本地存储的个人信息
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo) {
      // 如果有个人信息，在加载最近的音乐
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      this.getRecentMusicList(this.data.userInfo.userId)
    }
  },
  // 手指触摸动作开始
  handleTouchStart(event) {
    this.setData({
      // 清除下滑的动画效果
      transition:''
    })
    // 获取初始位置
    startY = event.touches[0].clientY
  },
  // 手指触摸后移动
  handleTouchMove(event) {
    // 获取移动后位置
    endY = event.touches[0].clientY
    distance = endY - startY
    if(distance < 0) return
    if(distance > 80) distance = 80
    this.setData({
      transform:`translateY(${distance}rpx)`
    })

  },
  // 手指触摸动作结束
  handleTouchEnd() {
    // 恢复原位
    this.setData({
      transform:`translateY(0rpx)`,
      transition:"transform 1s linear"
    })
  },
  // 点击头像跳转到login
  toLogin() {
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },
  // 获取用户最近播放信息
  async getRecentMusicList(userId) {
    let result = await login('/user/record' , {uid:userId , type:0})
    // 由于每个数据中没有id，所以在每个数据中加个id
    let index = 0
    let handleResult = result.data.allData?.slice(0,10).map((item)=>{
      item.id = index++
      return item
    })
    this.setData({
      recentMusicList:handleResult
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})