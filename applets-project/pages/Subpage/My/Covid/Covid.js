import Charts from '../../../../utils/wxcharts-min';
import {tianxingAPI} from '../../../../utils/util';
Page({
  data: {
    active:0,//tab切换
    desc:{},//疫情综合
    news:{},//新闻
  },
  onLoad: function (options) {
    this.showChart();
    this.getCovidData()
    // console.log(tianxingAPI);
  },
  showChart() {
    new Charts({
      canvasId: 'canvas1',
      dataPointShape: false,
      type: 'column',
      title:{
        // name:'啊实打实的'
      },
      categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2017'],
      series: [{
        name: '成交量1',
        data: [15, 20, 45, 37, 4, 80],
      },
      {
        name: '成交量2',
        data: [70, 40, 65, 100, 34, 18],
        color:"rgba(0,0,0,0.3)"
      },
      {
        name: '成交量3',
        data: [100, 50, 75, 200, 15, 13]
      }],
      yAxis: {
        format: function (val) {
          return val + '万';
        }
      },
      xAxis: {
        disableGrid: true,
      },
      width:350,
      height: 400,
      dataLabel: true,
      extra: {
        column: {
          width:20 //柱的宽度
        }
      }
    });
  },
  getCovidData(){//疫情数据请求
    tianxingAPI('ncov').then(res=>{
      let ncovData=res.newslist[0]
      this.setData({
        news:ncovData.news,//新闻
        desc:ncovData.desc,//大数据
      })
    })
  },
  onChangeTab(e){//监听tab
    console.log(e);
  },
  toexplain(){//打开说明
    wx.showToast({
      title: '说明',
      icon: 'none',
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