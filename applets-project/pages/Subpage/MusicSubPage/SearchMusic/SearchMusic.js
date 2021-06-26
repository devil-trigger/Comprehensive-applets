import {
    netEaseAPI,
} from '../../../../utils/util';
import Dialog from '../../../../dist/dialog/dialog';
Page({
    data: {
        defaultWord: '', //输入框-默认搜索热词
        AdvSwitch: false, //显示搜索建议
        adviseLoading: false, //loading显示（搜索建议）
        scarchAdvise: [], //搜索建议data
        searchHistory: '', //搜索历史
        historyTagdisplay:false,//搜索历史-渐变
        currentTab: 0, //热搜榜tab切换
        hotList: [], //热搜榜data
        value: '', //输入框内容
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) {
        this.setData({//获取-缓存搜索历史
            searchHistory:wx.getStorageSync('music_SearchHistory')
        })
        this.getHotList(); //热词
        this.getDefault(); //默认关键字
    },
    SearchFun(searchtext) { //搜索主函数
        let SearchArr=[];
        let storage=wx.getStorageSync('music_SearchHistory');//缓存
        if(storage!=''){//缓存有记录->赋值
            SearchArr=storage
        }
        if(SearchArr.includes(searchtext)!=true){//缓存不为空
            SearchArr.push(searchtext);
        }//缓存赋值
        //  console.log(SearchArr);
        this.setData({searchHistory:SearchArr})
        wx.setStorage({//加入缓存
            key: "music_SearchHistory",
            data: SearchArr
        })

        this.ToSearch('', {
            keywords: searchtext
        }, res => {
            // console.log(res)
        })
    },
    onSearchFun() { //点击搜索
        let ValueInfo=this.data.value;
        switch (ValueInfo == '') {
            case true: //没输入内容（搜索默认关键词）
                if (this.data.defaultWord == '') {
                    this.SearchFun('爱上未来的你-刘瑞琦');
                } else {
                    this.setData({
                        value: this.data.defultWord.realkeyword
                    });//默认关键词搜索
                    this.SearchFun(ValueInfo);
                }
                break;
            default:
                this.SearchFun(ValueInfo);
                break;
        }
    },
    getDefault() { //获取默认搜索关键词
        this.ToSearch('default', {}, res => {
            // console.log(res.data.data);
            this.setData({
                defaultWord: res.data.data
            })
        })
    },
    onAdvise(e){//点击——搜索建议
        // console.log(e.currentTarget.dataset.name)
        this.setData({
            value:e.currentTarget.dataset.name
        })
        this.SearchFun(e.currentTarget.dataset.name);
    },
    onClear() { //清除搜索栏
        this.setData({
            AdvSwitch: false, //建议栏关闭
            scarchAdvise: [], //建议栏内容清除
            adviseLoading:false//loading关闭
        })
    },
    onChange(e) { //监听搜索栏(显示搜索建议)
        if (e.detail == '' || new RegExp("^[ ]+$").test(e.detail)) {
            //无内容就不做请求
            // console.log('空内容')
            this.setData({
                AdvSwitch: false,
                scarchAdvise: []
            })
            return
        }
        this.setData({
            scarchAdvise: [],
            value: e.detail, //赋值value
            adviseLoading: true, //打开loading
            AdvSwitch: true, //打开页面
        })
        setTimeout(() => {
            this.ToSearch('suggest?type=mobile', {
                keywords: e.detail
            }, res => {
                // console.log(res.data.result);
                if (res.data.result.allMatch == undefined) {
                    this.setData({
                        scarchAdvise: [],
                        adviseLoading: false
                    })
                    return
                }
                this.setData({
                    scarchAdvise: res.data.result.allMatch,
                    adviseLoading: false
                })
            })
        }, 300)
    },
    getHotList() { //获取热搜data
        this.ToSearch('hot/detail', {}, res => {
            // console.log(res.data.data)
            this.setData({
                hotList: res.data.data
            })
        })
    },
    onShowTag(e){//设置搜索历史-渐变(显示)
        switch (e.detail.scrollLeft>=17) {
            case true:
                this.setData({
                    historyTagdisplay:true
                })
                break;
            default:
                this.setData({
                    historyTagdisplay:false
                })
                break;
        }
    },
    historyTagSearch(e) { //点击搜索历史tag
        let keyword = e.currentTarget.dataset.tag
        this.setData({value: keyword});
        this.SearchFun(keyword);
        // console.log(e.currentTarget.dataset.tag)
    },
    deleteHistory() { //删除搜索历史
        Dialog.confirm({
                title: '温馨提示',
                message: '确定删除历史记录吗？',
            })
            .then(() => {
                wx.removeStorage({
                    key: 'music_SearchHistory',
                })
                this.setData({searchHistory:''})
                // on confirm
                console.log('确定')
            })
            .catch(() => {
                // on cancel
                console.log('取消')
            });
    },
    swichNav(e) { //热搜榜 点击切换
        switch (this.data.currentTab == e.target.dataset.num) {
            case true:
                //  return;//判断重复点击
                console.log('重复点击')
                break;
            default:
                this.setData({
                    currentTab: e.target.dataset.num
                })
                break;
        }
    },
    slideChange(e) { //热搜榜滑动切换
        this.setData({
            currentTab: e.detail.current
        });
    },
    otherHot() { //展开更多热搜
        console.log('更多热搜')
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