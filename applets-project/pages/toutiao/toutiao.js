let clickTime = getApp().globalData.clickTime
Page({
  data: {
    NoDataSwitch: false, //无数据组件开关
    dataList: [],//头条新闻数据
    requestNum:10,
    swiperList: [{
        url: 'https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index.webp'
      },
      {
        url: 'https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index2.webp'
      },
      {
        url: 'https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index3.webp'
      },
      {
        url: 'https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index4.webp'
      },
      {
        url: 'https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index5.webp'
      },
      {
        url: 'https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index6.webp'
      },
    ],//轮播图图片
    listSwitch:false,//数据新增开关
  },
//生命周期函数--监听页面加载
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
    })
    setTimeout(() => {
      this.getdataList();
      wx.hideLoading();
    }, 1200)
  },
  getdataList() {
    wx.request({
      url: 'http://api.tianapi.com/topnews/index',
      data: {
        key: '869941cd56fe09e14b255d12467651bd',
        num: this.data.requestNum
      },
      success: res => {
        // console.log(res.data.newslist.length)
        if (res.data.newslist.length != 0) {
          let dataJson = res.data.newslist
          let d2 = new Date(clickTime.replace(/\-/g, "/"));
          let that = this;
          dataJson.forEach((item, index) => {
            let d1 = new Date(item.ctime.replace(/\-/g, "/"));
            //每份新闻的时间
            let agoTime = parseInt(d2 - d1) / 1000 / 60 / 60
            //新闻时间距打开小程序的时间
            // console.log(agoTime.toFixed(2));
            let time = that.timeFun(Number(agoTime.toFixed(2)))
            dataJson[index].ctime = time
          })
          this.setData({
            dataList: dataJson
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
  timeFun(timeAgo) { //时间处理函数
    // console.log(timeAgo);
    let timeText = ''
    if (timeAgo < 1) {
      timeText = timeText = Math.trunc(timeAgo * 60) + '分钟前'
      // console.log(timeText=timeAgo*30+'分钟前')
    } else if (timeAgo < 1 < 24) {
      timeText = Math.trunc(timeAgo) + '小时前'
      // console.log(Math.trunc(timeAgo)+'小时前')
    } else {
      timeText = timeAgo / 24 + '天前'
      // console.log(timeAgo/24)
    }
    return timeText
  },
  toToutiaoDetails(e) {
    // console.log(e.currentTarget.dataset.url)
    wx.navigateTo({
      url: `../Subpage/ToutiaoDetails/ToutiaoDetails?url=${e.currentTarget.dataset.url}`,
    })
  },
  reachBottomFun(){//触底加载函数
    let num=this.data.requestNum;
    if(num>=50){ num=40;}
    this.setData({
      listSwitch:true,
      requestNum:num+10
    })
    // console.log(this.data.requestNum)
    setTimeout(()=>{
      this.setData({listSwitch:false})
      if(this.data.dataList.length==50){
        wx.showToast({ title: '已全部加载完成...'})
        return
      }
      this.getdataList();
    },1777)
  },
//生命周期函数--监听页面初次渲染完成
  onReady: function () { },
//生命周期函数--监听页面显示
  onShow: function () {},
//生命周期函数--监听页面隐藏
  onHide: function () { },
//生命周期函数--监听页面卸载
  onUnload: function () { },
//页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    // console('ss')
    // wx.showNavigationBarLoading(); 
    // wx.showLoading({
    //   title: '刷新中...',
    // })
  },
//页面上拉触底事件的处理函数
  onReachBottom: function () {
    this.reachBottomFun()
  },

//用户点击右上角分享
  onShareAppMessage: function () {}
})