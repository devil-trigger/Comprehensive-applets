import utils from './utils/util.js'
App({
  async onLaunch() {
    this.globalData.clickTime=utils.formatTime(new Date());//储存打开小程序时间（头条）

    this.globalData.AudioCtx = wx.getBackgroundAudioManager();//定义播放器方法
    


    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
  },
  globalData: {
    clickTime:0,//打开小程序的时间
    AudioCtx:null,//播放器方法
  }
})
