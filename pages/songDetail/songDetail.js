// pages/songDetail/songDetail.js
import request from '../../utils/request'
import Pubsub from 'pubsub-js'
import moment from 'moment'
// 创建音乐播放的实例
let backgroundAudioManager = wx.getBackgroundAudioManager()
// 从全局读属性
const global = getApp()
// 定义全局定时器
let timer

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断音乐是否开始播放
    isPlay: false,
    // 歌曲详情详细
    songDetail: [],
    // 当前歌曲ID
    musicId: '',
    // 音乐的链接
    musicLink: '',
    // 音乐当前时间
    currentTime: '00:00',
    // 音乐总时长
    finalTime: '',
    // 进度条的动态宽度
    width: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取传过来的id
    let id = options.id
    this.setData({
      musicId: id
    })
    this.getSongDetail(id)
    // 判断当前页面是否有音乐在播放
    if (global.globalData.isMusicPlay && global.globalData.musicPlayId === id) {
      this.setData({
        isPlay: true
      })
    }
    // 监听音乐播放/暂停/停止，因为除了在播放界面，在主界面，用户点击播放暂停也需要监听
    backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: true
      })
      // 修改全局音乐播放状态
      global.globalData.isMusicPlay = true
      global.globalData.musicPlayId = id
    })
    backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      })
      global.globalData.isMusicPlay = false

    })
    backgroundAudioManager.onStop(() => {
      this.setData({
        isPlay: false
      })
      global.globalData.isMusicPlay = false

    })
    // 监听音频当前已经播放的时间以及总时长
    backgroundAudioManager.onTimeUpdate(() => {
      // console.log(backgroundAudioManager.currentTime);
      // console.log(backgroundAudioManager.duration);
      let currentTime = moment(backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let width = (backgroundAudioManager.currentTime / backgroundAudioManager.duration) * 450
      this.setData({
        currentTime,
        width
      })
    })
    // 监听当前页面自动播放结束，就得切换到下一首
    backgroundAudioManager.onEnded(() => {
      // console.log("歌曲结束了");
      // 订阅要展示的歌曲id
      Pubsub.subscribe('nextId', (msg, nextId) => {
        // 切换下一首歌的详情
        this.getSongDetail(nextId)
        // 更新下一首歌的id
        this.setData({
          musicId: nextId
        })
        // 点击切歌后直接播放
        this.playOrPause(true)
        // 取消订阅
        Pubsub.unsubscribe('nextId')
      })
      // 进度条归零
      this.setData({
        isPlay: false,
        currentTime: '00:00',
        width: 0
      })
      Pubsub.publish('type', 'next')

    })
  },
  // 播放/暂停按钮处理函数
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    // 上面进行了监听，这里就不用修改了
    this.setData({
      isPlay
    })
    let {
      musicLink
    } = this.data
    this.playOrPause(isPlay, musicLink)
  },
  async playOrPause(isPlay, musicLink) {

    // 开始播放
    if (isPlay) {
      // 如果音乐链接属性中有值，那就不用在发送请求，直接用链接里的值，如果没有再请求。就是同一首歌在点击暂停播放后只请求一次
      if (!musicLink) {
        let result = await request('/song/url', {
          id: this.data.musicId
        })
        musicLink = result.data[0].url
        this.setData({
          musicLink
        })
      }
      // 想要播放，就得设置实例的src以及title
      backgroundAudioManager.src = musicLink
      backgroundAudioManager.title = this.data.songDetail[0].name
    }
    // 暂停播放
    else {
      backgroundAudioManager.pause();
    }
  },
  // 获取歌曲详情
  async getSongDetail(id) {
    let result = await request('/song/detail', {
      ids: id
    })
    let finalTime = moment(result.songs[0].dt).format("mm:ss")
    this.setData({
      songDetail: result.songs,
      finalTime
    })
    wx.setNavigationBarTitle({
      title: result.songs[0].name,
    })
  },
  // 点击切歌按钮
  changeMusic(event) {
    // 结束当前歌曲播放
    backgroundAudioManager.stop()
    // 订阅要展示的歌曲id
    Pubsub.subscribe('nextId', (msg, nextId) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        // 切换下一首歌的详情
        this.getSongDetail(nextId)
        // 更新下一首歌的id
        this.setData({
          musicId: nextId
        })
        // 点击切歌后直接播放
        this.playOrPause(true)
        // 取消订阅
        Pubsub.unsubscribe('nextId')
      }, 1000);
    })
    Pubsub.publish('type', event.currentTarget.id)
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