Page({
  data: {
    NoDataSwitch: false, //无数据组件显示情况
    dataList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
    })
    setTimeout(()=>{
      this.getdataList();
      wx.hideLoading();
    },1200)
    
  },
  getdataList() {
    wx.request({
      url: 'http://api.tianapi.com/topnews/index',
      data: {
        key: '869941cd56fe09e14b255d12467651bd',
        num: 10
      },
      success: res => {
        console.log(res.data.newslist)
        if (res.data.newslist.length != 0) {
          // let dataJson = res.data.newslist
          // res.data.newslist.forEach((item, index) => {
          //   console.log(item.ctime.substring(0, 10))
          // })
          this.setData({
            dataList: res.data.newslist
          })
        } else {
          this.setData({
            NoDataSwitch: true
          })
        }
      },
      fail: err => {
        if (err) {
          console.log(err)
          this.setData({
            NoDataSwitch: true
          })
        }
      }
    })
  },
  toToutiaoDetails(e) {
    // console.log(e.currentTarget.dataset.url)
    wx.navigateTo({
      url: `../Subpage/ToutiaoDetails/ToutiaoDetails?url=${e.currentTarget.dataset.url}`,
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
    console('ss')
    // wx.showNavigationBarLoading(); 
    // wx.showLoading({
    //   title: '刷新中...',
    // })
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