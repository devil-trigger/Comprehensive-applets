import {netEaseAPI,} from '../../../../utils/util';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:null,
        playData:0,
        otherData:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            this.setData({
                id:options.id
            })
        }else{
            this.setData({
                id:5033464627
            })
        }

        this.getplayDetails(this.data.id)//详情
        this.getDynamic(this.data.id)//评论
    },
    getplayDetails(playid){//歌单详情内容
        netEaseAPI('playlist/detail',{id:playid}).then(res=>{
            console.log(res.data)
            this.setData({
                playData:res.data
            })
        })
    },
    getDynamic(playid){//歌单详情其他（评论、播放数）
        netEaseAPI('playlist/detail/dynamic',{id:playid}).then(res=>{
            console.log(res.data)
            this.setData({otherData:res.data})
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