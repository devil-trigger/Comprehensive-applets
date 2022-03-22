Page({
    data: {
        theElement: []
    },
    onLoad: function (options) {

    },
    toView(e){//点击进入
        console.log(e.currentTarget.dataset.url);
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
        this.setData({
            theElement: [{
                    title: '快递查询',
                    name: 'express',
                    color: 'cyan',
                    cuIcon: 'deliver_fill',
                    url: ''
                },
                {
                    title: '每日一图',
                    name: 'background',
                    color: 'blue',
                    cuIcon: 'colorlens',
                    url: ''
                },
                {
                    title: '漫画',
                    name: 'cartoon',
                    color: 'purple',
                    cuIcon: 'picfill',
                    url: ''
                },
                {
                    title: '图标 ',
                    name: 'icon',
                    color: 'mauve',
                    cuIcon: 'pay',
                    url: ''
                },
                {
                    title: '按钮',
                    name: 'button',
                    color: 'pink',
                    cuIcon: 'btn',
                    url: ''
                },
                {
                    title: '标签',
                    name: 'tag',
                    color: 'brown',
                    cuIcon: 'tagfill',
                    url: ''
                },
            ],
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            theElement: []
        })
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