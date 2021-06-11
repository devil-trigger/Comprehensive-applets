let utils=require('./utils/util.js').default
App({
  onLaunch() {
    this.globalData.clickTime=utils.formatTime(new Date())
    // console.log(this.globalData.clickTime);
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
    // userInfo: null
    clickTime:0
  }
})
