import utils from './utils/util.js'
App({
  onLaunch() {
    this.globalData.clickTime=utils.formatTime(new Date())
    // console.log(typeof(this.globalData.clickTime));
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
  }
})
