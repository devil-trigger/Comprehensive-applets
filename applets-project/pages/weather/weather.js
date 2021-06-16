Page({
    data: {
        navigationSty:{//标题栏样式（适配）
            navBarHeight:0,
            menuRight:0,
            menuBotton:0,
            menuHeight:0
        }
    },
    onLoad: function (options) {
        this.setNavigationSty();
    },
    setNavigationSty(){//设置标题栏高度
        let systemInfo=wx.getSystemInfoSync();
        let menuInfo=wx.getMenuButtonBoundingClientRect();
        let datajson={};
        datajson.navBarHeight=(menuInfo.top - systemInfo.statusBarHeight) * 2 + menuInfo.height + systemInfo.statusBarHeight;//导航栏高度
        datajson.menuBotton=menuInfo.top - systemInfo.statusBarHeight;//胶囊距底部间距（保持底部间距一致）
        datajson.menuRight=systemInfo.screenWidth - menuInfo.right;// 胶囊距右方间距（方保持左、右间距一致）
        datajson.menuHeight= menuInfo.height;// 胶囊高度（自定义内容可与胶囊高度保证一致）
        this.setData({navigationSty:datajson})
       console.log(datajson)
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