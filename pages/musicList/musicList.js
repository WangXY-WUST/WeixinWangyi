import request from '../../utils/request'
import Pubsub from 'pubsub-js'

// pages/musicList/musicList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mon: '',
    day: '',
    musicList: [],
    // 点击歌的索引，用来判断是哪一首歌的上一首/下一首
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      mon: new Date().getMonth() + 1,
      day: new Date().getDate()
    })
    let userInfo = wx.getStorageSync('userInfo')
    // 判断是否登录
    if (userInfo) {
      this.getMusicList()
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          //跳转到登录界面
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }, 1000);
        }
      })
    }
    // 订阅切歌的类型，是下一首还是上一首
    Pubsub.subscribe('type' , (msg , type)=>{
      let {musicList , index} = this.data
      // 如果是上一首
      if(type === 'pre'){
        // 改变索引，
        if(index === 0) {
          index = musicList.length
        }
        index = index - 1
      }
      // 如果是下一首
      else{
        if(index === musicList.length) index = -1
        index = index + 1
      }
      // 更新索引值
      this.setData({
        index
      })
      let nextId = musicList[index].id
      Pubsub.publish('nextId' , nextId)
    })
  },
  // 获取歌单
  async getMusicList() {
    let result = await request('/recommend/songs')
    this.setData({
      musicList: result.recommend
    })
  },
  // 点击跳转到详情页
  toSongDetail(event) {
    this.setData({
      index:event.currentTarget.dataset.index
    })
    wx.navigateTo({
      // 由于页面跳转时携带参数长度有限，所以传个id过去，到详情页在请求详情
      url: `/pages/songDetail/songDetail?id=${event.currentTarget.dataset.songid.id}`,
    })
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