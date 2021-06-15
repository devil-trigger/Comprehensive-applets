let clickTime = getApp().globalData.clickTime;
import utils from '../..//utils/util.js'
Page({
  data: {
    NoDataSwitch: false, //无数据组件开关
    dataList: [],//头条新闻数据
    requestNum:10,
    swiperList: ['https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index.webp','https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index2.webp','https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index3.webp','https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index4.webp','https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index5.webp','https://cdn.jsdelivr.net/gh/devil-trigger/sdn@master/index-img/index6.webp'
    ],//轮播图图片
    listSwitch:false,//数据新增开关
  },
//生命周期函数--监听页面加载
  onLoad: function () { },
  timeFun(timeAgo) { //时间处理函数，返回（x分钟、x小时、x天前）
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
  getdataList() {//请求新闻数据
    wx.request({
      url: 'http://api.tianapi.com/topnews/index',
      data: {
        key: '869941cd56fe09e14b255d12467651bd',
        num: this.data.requestNum
      },
      success: res => {
        // console.log(res.data.newslist)
        if (res.data.newslist.length != 0) {
          let dataJson = res.data.newslist
          let d2 = new Date(clickTime);//小程序打开时间
          let that = this;
          dataJson.forEach((item, index) => {
            let d1 = new Date(item.ctime.replace(/\-/g, "/"));//新闻时间
            let agoTime = parseInt(d2 - d1) / 1000 / 60 / 60;
            //新闻时间距打开小程序的时间↑
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
  SetStorageTime(){//设置缓存时间以及其他事项
    let RequestTime=utils.formatTime(new Date());//当前时间
    let NewBrowse=new Date();//当前时间（转换）
    let UseDBrowse=utils.ChangeTime(wx.getStorageSync('TouTiaoTime'));//上次请求时间(转换)
    let diff=(NewBrowse.getTime()-UseDBrowse.getTime())%(24*3600*1000)%(3600*1000);
    let min=Math.floor(diff/(60*1000));//分钟
    // console.log(min>7)
    if(min>=7&&wx.getStorageSync('TouTiaoTime')){//大于7分钟就请求
      console.log('有缓存且已超过7min，即刻更新！');
      wx.setStorage({//缓存浏览时间
        key:"TouTiaoTime",
        data:RequestTime
      })
      wx.showLoading({
        title: '数据加载中...',
        mask: true,
      })
      setTimeout(() => {
        this.getdataList();
        wx.hideLoading();
      }, 1200)
    }else{
        if(wx.getStorageSync('TouTiaoTime')==''||this.data.dataList.length==0){
          console.log('无缓存或刷新了，需请求');
          wx.setStorage({//缓存浏览时间
            key:"TouTiaoTime",
            data:RequestTime
          })
          wx.showLoading({
            title: '数据加载中...',
            mask: true,
          })
          setTimeout(() => {
            this.getdataList();
            wx.hideLoading();
          }, 1200)
        }else {
          console.log('有缓存且不超过7分钟，不更新')
          return
        }
    }
  },
  toToutiaoDetails(e) {//打开头条新闻详情
    wx.navigateTo({
      url: `../Subpage/ToutiaoDetails/ToutiaoDetails?url=${e.currentTarget.dataset.url}`,
    })
  },
  toImage(e){//轮播图 图片查看器
    // console.log(e.currentTarget.dataset.index)
    let arr=this.data.swiperList
    wx.previewImage({
      urls: arr,
      current:arr[e.currentTarget.dataset.index]
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
  onShow: function () {
    this.SetStorageTime()
  },
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