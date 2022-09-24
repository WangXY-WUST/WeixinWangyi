// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 视频标签列表
    videoList: [],
    // 当前点击的标签ID
    navId: 58100,
    // 视频列表
    videoGroup: [],
    // video的Id
    videoId: '',
    //存储videoid和此id已经播放的时长
    videoUpdateTime: [],
    // 判断是否在刷新
    isFresh:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getVideoList()
    let userInfo = wx.getStorageSync('userInfo')
    // 判断是否登录
    if(userInfo) {
      this.getVideoGroup()
    }
    else {
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
    }

  },
  // 获取视频标签列表
  async getVideoList() {
    let result = await request('/video/group/list')
    this.setData({
      videoList: result.data.slice(0, 20)
    })
  },
  // 处理点击标签栏事件
  handleBindTap(event) {
    this.setData({
      navId: event.currentTarget.id * 1,
      // 切换的时候把之前的数据清空
      videoGroup: []
    })
    wx.showLoading({
      title: '正在加载'
    })
    // 获取新的数据
    this.getVideoGroup(this.data.navId)
  },
  // 获取视频列表
  async getVideoGroup() {
    let result = await request('/video/group', {
      id: this.data.navId
    })
    // 隐藏加载
    wx.hideLoading()
    let index = 0
    let videoGroup = result.datas.map(item => {
      item.id = index++
      return item
    })
    // 将刷新状态改为false
    this.setData({
      videoGroup,
      isFresh:false
    })
  },
  // 点击视频播放事件以及video、image切换事件
  handlePlay(event) {
    /* 
     *第一次进来this上没有videocontext这个值，就新建一个videoContext挂到this身上，当下次进来，this.videoContext上就是
     *上次点击的那个视频。如果这个视频id和上个视频id不相等，就是说点的是另一个视频，就停止，
     */
    // 如果两次id不相同，就暂停上一个，开始下一个
    // this.vid && this.vid !==event.currentTarget.id &&  this.videoContext && this.videoContext.stop()
    // 把当前id赋给this（这里的this是video组件）。当下次进来比较两次的id是否相同
    // this.vid = event.currentTarget.id
    // 创建控制video组件的实例对象，并赋值给this
    this.videoContext = wx.createVideoContext(event.currentTarget.id)
    // 通过图片点进来直接播放，不用再次点击
    this.videoContext.play()

    // 判断当前视频之前是否播放过
    let time = this.data.videoUpdateTime.find(item => {
      item.vid = event.currentTarget.id
    })
    if (time) {
      this.videoContext.seek(time)
    }
    this.setData({
      videoId: event.currentTarget.id
    })
  },
  // 再次播放跳转到指定位置的回调
  handleTimeUpdate(event) {
    let {videoUpdateTime} = this.data
    // 判断数组中有没有这个ID
    let videoItem = videoUpdateTime.find(item => item.vid === event.currentTarget.id)
    // 如果有，只更改时间，如果没有，就push进去
    if (videoItem) {
      videoItem.time = event.detail.currentTime
    } else {
      videoUpdateTime.push({
        vid: event.currentTarget.id,
        time: event.detail.currentTime
      })
    }
    this.setData({
      videoUpdateTime
    })
  },
  // 播放结束触发
  handleEnd(event) {
    let {videoUpdateTime} = this.data
  //  播放结束，就去除
    videoUpdateTime.splice( videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id) , 1)
    this.setData({
      videoUpdateTime
    })
  },
  // 下拉刷新触发
  handleRefresh() {
    this.setData({
      isFresh:true
    })
    this.getVideoGroup()
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