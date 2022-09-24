// pages/musicCategories/musicCategories.js
import login from '../../utils/login'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 歌曲标签
    navTag:[],
    // 存储歌单
    musicList:[],
    // 被点击的标签名
    tagName:'华语',
    // 被点击的标签
    currentId:5001
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getNavTag()
    this.getMusicList()
  },
  // 获取歌单标签
  async getNavTag() {
    let result = await login('/playlist/highquality/tags')
    this.setData({
      navTag:result.data.tags
    })
  },
  // 点击事件，获取分类名称
  getCategoryName(event) {
    this.setData({
      musicList:[],
      currentId:event.currentTarget.id * 1,
      tagName:event.currentTarget.dataset.name
    })
    this.getMusicList()
  },
  // 获取歌单数据
  async getMusicList() {
    let result = await login('/top/playlist/highquality' , {cat:this.data.tagName})
    this.setData({
      musicList:result.data.playlists
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