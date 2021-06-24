import {
    netEaseAPI,
} from '../../../../utils/util';
import Dialog from '../../../../dist/dialog/dialog';
Page({
    data: {
        searchHistory: ['艾薇儿', '周杰伦'], //搜索历史
        currentTab: 0, //热搜榜tab切换
        hotList:[],//热搜榜data
        active: 0,
        value: '',
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        this.getHotList()
    },
    SearchFun(searchtext) { //搜索！
        this.ToSearch('', {
            keywords: searchtext
        }, res => {
            console.log(res)
        })
    },
    onChange(e) { //监听搜索栏(显示搜索建议)
        this.ToSearch('suggest?type=mobile', {
            keywords: e.detail
        }, res => {
            console.log(res)
        })
    },
    getHotList(){//获取热搜data
        this.ToSearch('hot/detail',{},res=>{
            console.log(res.data.data)
            this.setData({
                hotList:res.data.data
            })
        })
    },
    historyTagSearch(e) { //点击搜索历史tag
        let keyword = e.currentTarget.dataset.tag
        this.setData({
            value: keyword
        })
        this.SearchFun(keyword)
        // console.log(e.currentTarget.dataset.tag)
    },
    deleteHistory() { //删除搜索历史
        Dialog.confirm({
                title: '温馨提示',
                message: '确定删除历史记录吗？',
            })
            .then(() => {
                // on confirm
                console.log('确定')
                // wx.removeStorage({
                //     key: 'music_SearchHistory',
                // })
            })
            .catch(() => {
                // on cancel
                console.log('取消')
            });
    },
    swichNav(e) {//热搜榜 点击切换
        switch (this.data.currentTab==e.target.dataset.num) {
            case true:
                //  return;//判断重复点击
                console.log('重复点击')
                break;
            default:
                this.setData({currentTab:e.target.dataset.num})
                break;
        }
    },
    slideChange(e) {//热搜榜滑动切换
        this.setData({
            currentTab: e.detail.current
        });
    },
    //生命周期函数--监听页面初次渲染完成
    onReady: function () {},

    //生命周期函数--监听页面显示
    onShow: function () {

    },

    //生命周期函数--监听页面隐藏
    onHide: function () {},

    //生命周期函数--监听页面卸载
    onUnload: function () {},

    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {},

    //页面上拉触底事件的处理函数
    onReachBottom: function () {},

    //用户点击右上角分享
    onShareAppMessage: function () {},
    ToSearch(url, data, callback) { //搜索函数封装
        netEaseAPI('search/' + url, data).then(res => {
            callback(res)
        }, err => { //搜索失败
            console.log(err)
        })
    }
})