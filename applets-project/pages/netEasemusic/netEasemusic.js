import {
    netEaseAPI,
    getSongDetails
} from '../../utils/util';
Page({
    data: {
        SortList: [ //分类
            {
                url: 'gedan',
                name: '歌单'
            },
            {
                url: 'gengxin',
                name: '每日推荐'
            },
            {
                url: 'paihang',
                name: '排行榜'
            },
        ],
        swiperList: [], //轮播图data
        remdList: [], //推荐歌单data
        highList: [], //精品歌单
        remdSongList: [], //随机歌曲data
        SongData: {
            type: 'default',
        }, //播放歌曲列表data
    },
    onLoad: function (options) {
        this.getdata();
    },
    getdata() { //请求数据function
        this.getSwiperlist(); //轮播图
        this.getRemdList(); //歌单
        this.getRemdSongList(); //歌曲
        netEaseAPI('top/playlist/highquality').then(res => { //专辑
            let dataArr = res.data.playlists;
            dataArr.forEach((item, index) => {
                let count = item.playCount.toString(); //播放量
                if (count.length >= 5) { //万播放量
                    let sliceNum = count.length - 4;
                    let countText = count.slice(0, sliceNum);
                    if (countText.length < 3) {
                        let decimal = count.slice(sliceNum, sliceNum + 1);
                        // console.log(countText+'.'+decimal);
                        dataArr[index].playVolume = countText + '.' + decimal;
                    } else {
                        dataArr[index].playVolume = countText;
                    }
                    // console.log(dataArr[index]);
                } else if (count.length < 5) { //千\百播放量
                    dataArr[index].playVolume = count;
                }
                item.picUrl = item.coverImgUrl
            })
            this.setData({
                highList: dataArr
            })
            // console.log(this.data.highList);
        })
    },
    getSwiperlist() { //获取轮播图数据
        netEaseAPI('banner?type=2').then(res => {
            // type  0.pc 1.android 2.iphone 3.ipad
            this.setData({
                swiperList: res.data.banners
            })
        })
    },
    getRemdList() { //获取推荐歌单（网友精选碟）
        netEaseAPI('personalized?limit=10').then(res => {
            //    console.log(res.data.result[0]);
            let dataArr = res.data.result;
            dataArr.forEach((item, index) => {
                let count = item.playCount.toString(); //播放量
                if (count.length >= 5) { //万播放量
                    let sliceNum = count.length - 4;
                    let countText = count.slice(0, sliceNum);
                    if (countText.length < 3) {
                        let decimal = count.slice(sliceNum, sliceNum + 1);
                        // console.log(countText+'.'+decimal);
                        dataArr[index].playVolume = countText + '.' + decimal;
                    } else {
                        dataArr[index].playVolume = countText;
                    }
                    // console.log(dataArr[index]);
                } else if (count.length < 5) { //千播放量
                    dataArr[index].playVolume = count;
                }
            })
            this.setData({
                remdList: dataArr
            })
        })
    },
    getRemdSongList() { //获取推荐歌曲 （你在找的华语歌）
        netEaseAPI('personalized/newsong?limit=9').then(res => {
            this.setData({
                remdSongList: res.data.result
            })
        })
    },
    toBannerDetails(e) { //点击轮播图图片 进入详情
        // console.log(e.currentTarget.dataset.url);
        let toUrl = '';
        switch (e.currentTarget.dataset.url != null) {
            case true:
                toUrl = e.currentTarget.dataset.url
                break;
            default:
                toUrl = 'https://y.music.163.com/m/';
                break;
        }
        wx.showLoading({
            title: '正在进入...',
            mask: true
        })
        setTimeout(() => {
            wx.hideLoading({})
            wx.navigateTo({
                url: `/pages/Subpage/MusicSubPage/bannerDetails/bannerDetails?url=${toUrl}`
            })
        }, 1500);

    },
    toSearch() { //进入搜索界面
        wx.navigateTo({
            url: '/pages/Subpage/MusicSubPage/SearchMusic/SearchMusic'
        })
    },
    playlist(e) { //点击歌单
        netEaseAPI('playlist/detail', {
            id: e.detail
        }).then(res => {
            getSongDetails(res.data.playlist.trackIds).then(res => {
                // console.log(res);
                let datalist = {};
                datalist.type = '';
                datalist.songs = res.songs;
                console.log(datalist);
                //name歌名、ar艺术家(name:歌手名、id：id)、al专辑（专辑图）
                // this.setData({
                //     SongData:datalist
                // })
            })
        })
    },
    empty() { //清空 播放列表 + +
        if (this.data.SongData.type == 'none') {
            wx.showToast({
                title: '已清空',
                icon: 'none',
                mask: true,
            })
            return
        }; //无数据则无法清空
        wx.showModal({
            cancelColor: '#000',
            title: '温馨提示',
            content: '确定清空列表？',
        }).then(res => {
            switch (res.confirm) {
                case true:
                    this.setData({
                        SongData: {
                            type: 'none'
                        }
                    })
                    wx.showToast({
                        title: '已清空',
                        icon: 'none',
                        mask: true,
                    })
                    break;
                default:
                    console.log('取消')
                    break;
            }
        })
    },
    deleteSong(e) { //删除歌曲
        switch (typeof (e.detail)) {
            case 'string':
                this.setData({
                    'SongData.type': e.detail
                })
                break;
            default:
                console.log('删除歌曲' + e.detail);
                break;
        }
        // let newArr=this.data.SongData;
        // // newArr.slice(e.detail,1);
    },
    createDefault() { //生成默认音乐
        this.setData({
            SongData: {
                type: 'default'
            }
        })
    },
    playSonglist(e) { //播放随机列表
        wx.showToast({
            icon: 'loading',
            title: '播放中..',
            mask: true
        })
        getSongDetails(e.detail).then(res => {
            let dataJson = {
                type: 'remdlist',
                songs: res.songs
            };
            this.setData({
                SongData: dataJson
            });
        })
    },
    remdplaySong(e) { //songlist 单曲播放
        getSongDetails(e.detail).then(res => {
            let jsondata = {
                songs: []
            };
            switch (this.data.SongData.type) {
                case 'default': //有默认歌曲
                    jsondata.type = 'remd';
                    jsondata.songs.push(res.songs[0])
                    break;
                case 'none': //无歌曲
                    jsondata.type = 'remd';
                    jsondata.songs.push(res.songs[0])
                    break;
                default: //正常列表        
                    jsondata.type = this.data.SongData.type;
                    jsondata.songs = this.data.SongData.songs;
                    jsondata.songs.push(res.songs[0])
                    break;
            }
            // console.log(jsondata);
            this.setData({
                SongData: jsondata
            })
        })

    },
    //生命周期函数--监听页面初次渲染完成
    onReady: function () {},
    //生命周期函数--监听页面显示
    onShow: function () {},
    //生命周期函数--监听页面隐藏
    onHide: function () {},
    //生命周期函数--监听页面卸载
    onUnload: function () {},
    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {},
    //页面上拉触底事件的处理函数
    onReachBottom: function () {},
    //用户点击右上角分享
    onShareAppMessage: function () {}
})