// pages/search/search.js
import request from '../../utils/request'
let timer   //定义一个全局定时器

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 热搜榜数据
    hostList: [],
    // 默认搜索关键字
    placeholder: '',
    // 搜索关键字
    keywords: '',
    // 搜索结果
    searchList: [],
    // 历史记录
    // historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHostList()
    this.getSearchDefault()
    // 读取本地的搜索历史
    /* let historyList = wx.getStorageSync('history')
    if(historyList)
    {
      this.setData({
        historyList
      })
    } */
  },


  // 获取热搜榜数据
  async getHostList() {
    let result = await request('/search/hot/detail')
    let index = 0
    let hostList = result.data.map((item) => {
      item.key = index++
      return item
    })
    this.setData({
      hostList
    })
  },
  // 获取默认搜索关键字
  async getSearchDefault() {
    let result = await request('/search/default')
    this.setData({
      placeholder: result.data.realkeyword
    })
  },
  // 搜索的函数
  handleSearch(event) {
    this.setData({
      keywords: event.detail.value.trim()
    })
    // 这是防抖
    if(timer) clearTimeout(timer)   //如果有定时器，就清空定时器
    timer = setTimeout(() => {//没有定时器，就加一个定时器
      this.getSearchList()
    }, 300);
  },
  // 获取搜索结果
  async getSearchList() {
    let {
      // historyList,
      keywords
    } = this.data
    // 没有关键字就不用发请求
    if (!this.data.keywords) {
      this.setData({
        // 清空搜索列表，搜索列表就不显示了
        searchList: []
      })
      return
    }
    let result = await request('/search', {
      keywords: keywords,
      limit: 10
    })
    if(result.result.songs){
    this.setData({
      searchList: result.result.songs,
    })
  }
    /* // 判读历史记录中是否有重复的元素
    if(historyList.indexOf(keywords) !== -1) {
      historyList.splice(historyList.indexOf(keywords) , 1)
    }
    historyList.unshift(keywords)
    this.setData({
      historyList
    })
    wx.setStorageSync('history', historyList) */
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