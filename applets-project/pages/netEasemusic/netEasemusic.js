import {
    netEaseAPI,
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
        remdSongList: [
            [{
                    picUrl: 'https://pic4.zhimg.com/50/v2-a436f4c1749c1127b6d4c73a74bdb2cd_720w.jpg?source=54b3c3a5',
                    name: '22',
                    singer: 'Taylor Swift'
                },
                {
                    picUrl: 'https://pic4.zhimg.com/50/v2-a436f4c1749c1127b6d4c73a74bdb2cd_720w.jpg?source=54b3c3a5',
                    name: '22',
                    singer: 'Taylor Swift'
                },
                {
                    picUrl: 'https://pic4.zhimg.com/50/v2-a436f4c1749c1127b6d4c73a74bdb2cd_720w.jpg?source=54b3c3a5',
                    name: '22',
                    singer: 'Taylor Swift'
                },
            ],
            [{
                picUrl: 'https://pic4.zhimg.com/50/v2-a436f4c1749c1127b6d4c73a74bdb2cd_720w.jpg?source=54b3c3a5',
                songtitle: '22',
                singer: 'Taylor Swift'
            }]
        ], //随机歌曲data
        SongData: [], //播放歌曲列表data

    },
    onLoad: function (options) {
        this.getdata();

    },
    getdata() {
        // this.getSongDetails();//歌曲详情
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
            // console.log(res.data);
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
    getRemdSongList() { //获取推荐歌曲
        netEaseAPI('personalized/newsong?limit=12').then(res => {
            //    console.log(res.data.result);
            let dataArr = res.data.result;
            let datalist = [];
            let num = 0;
            let singerName = ''
            dataArr.forEach((item, index) => {
                item.song.artists.forEach((a, b) => { //歌手数组处理
                    singerName += '/' + a.name
                    if (item.song.artists.length == b + 1) {
                        dataArr[index].singer = singerName.substr(1)
                        // console.log(dataArr)
                        singerName = ''
                    }
                })
                let groupNum = index + 1;
                if (groupNum % 3 == 0) { //音乐分组
                    let count = groupNum;
                    datalist.push(dataArr.slice(num, count))
                    num = count;
                    // console.log(datalist,num)
                    if (datalist.length == 4) {
                        this.setData({
                            remdSongList: datalist
                        })
                        //  console.log(this.data.remdSongList);
                    }
                }
            })
        })
    },
    getSongDetails() {
        netEaseAPI('song/url', {
            id: '1822297556'
        }).then(res => {
            console.log(res.data)
        })
    },
    toBannerDetails(e) { //点击轮播图图片 进入详情
        console.log(e.currentTarget.dataset.url);
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
    playlist(e) {
        netEaseAPI('playlist/detail', {
            id: e.detail
        }).then(res => {
            // console.log(res.data.playlist.trackIds);
            let Idtext = '';
            res.data.playlist.trackIds.forEach(item => {
                Idtext += `,${item.id}`
            })
            Idtext = Idtext.substr(1)
            netEaseAPI('song/detail?', {
                ids: Idtext
            }).then(res => {
                console.log(res.data.songs[0]);
                //name歌名、ar艺术家(name:歌手名、id：id)、al专辑（专辑图）
            })
        })
    },
    empty() {
        wx.showModal({
            cancelColor: '#000',
            title: '温馨提示',
            content: '确定清空列表？',
        }).then(res => {
            switch (res.confirm) {
                case true:
                    console.log('确认')
                    break;
                default:
                    console.log('取消')
                    break;
            }
        })
    },
    deleteSong(e){
        console.log('删除歌曲'+e.detail);
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