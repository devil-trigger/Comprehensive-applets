Page({
    data: {
        value:'',//搜索的内容
        HotWords:[
          {
            text:'喜剧',
            size:'',
            color:''
          },
          {
            text:'豆瓣高分',
            size:'',
            color:''
          },
          {
            text:'日本',
            size:'',
            color:''
          },
          {
            text:'冷门佳片',
            size:'',
            color:''
          },
          {
            text:'悬疑',
            size:'',
            color:''
          },
        ],//搜索热词
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getTag()
      this.tagStyleFun()
    },
    tagStyleFun(){//文字样式函数
      let textSize=['xl','sm','df','lg','sl','xxl'];//4类大小
      let hotword=this.data.HotWords;
      hotword.forEach((item,index)=>{
        let color='#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
        let size=textSize[Math.floor(Math.random()*6)]
        item.color=color;//随机颜色
        item.size=size;
        // console.log(textSize[Math.floor(Math.random()*4)])
        if(index==hotword.length-1){
          this.setData({//达到最大值后赋值
            HotWords:hotword
          })

        }
      })
    },
    getTag(){//获取热搜标签词
      wx.request({
        url: 'https://movie.douban.com/j/search_tags',
        header: { 'content-type': 'json'},
        success:res=>{
          // console.log(res.data.tags);
          let TagDataArr=[];
          let tagData=res.data.tags;
          tagData.forEach((item,index)=>{
            let tagJson={}
            tagJson.text=item;
            TagDataArr.push(tagJson);
            if(index==tagData.length-1){
              this.setData({
                HotWords:TagDataArr
              })
              this.tagStyleFun()
            }
          })
        }
      })
    },
    setTagWord(e){//设置tag热词
        // console.log(e.currentTarget.dataset.text);
        wx.showToast({
          title:e.currentTarget.dataset.text ,icon:'none'
        })
    },
    getFilmData(){//数据
      wx.request({
          url: 'https://movie.querydata.org/api',
          data: {
              id:34913671
          },
          header: { 'content-type': 'application/json'},
          success (res) {
            console.log(res.data)
          }
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