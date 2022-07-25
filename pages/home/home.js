// pages/home/home.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendMusicList: [],
    topMusicList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getbannerList(),
      this.getRecommend(),
      this.getTopMusic()

  },
  // 获取轮播图列表
  async getbannerList() {
    // 使用封装的请求函数
    let result = await request('/banner', {
      type: 2
    })
    this.setData({
      bannerList: result.banners
    })
  },
  // 获取推荐歌曲
  async getRecommend() {
    let result = await request('/personalized')
    this.setData({
      recommendMusicList: result.result
    })
  },
  // 获取排行榜数据
  async getTopMusic() {
    // 定义个索引，第一次只拿五个榜单
    let index = 0;
    // 定义一个数组，用来总结结果
    let resultArr = []
    while (index < 5) {
      let result = await request('/top/list', {
        idx: index++
      })
      // 只取自己需要的
      let handle = {
        name: result.playlist.name,
        tracks: result.playlist.tracks.slice(0, 3)
      }
      // 取完以后，push进去
      resultArr.push(handle)
    }
    // 将结果赋给list
    this.setData({
      topMusicList: resultArr
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