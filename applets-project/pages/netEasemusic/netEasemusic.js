import {
    netEaseAPI,
    setNavSty
} from '../../utils/util';
Page({
    data: {
        navigationSty: { //标题栏样式（适配）
            navBarHeight: 0,
            menuRight: 0,
            menuBotton: 0,
            menuHeight: 0
        },
        bannerImgHeight: 0,//轮播图图片高度
        swiperList: [], //轮播图data
        remdList: [], //推荐歌单data
        newAlbums:[],//新专辑data
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
        SongData:[//播放歌曲data
            {
                name:'淘汰',
                album:'',
                singer:'陈奕迅',
                cover:'https://cdn.jsdelivr.net/gh/devil-trigger/Comprehensive-applets@master/小程序其他文件/demo1.jpg',
                src:'https://cdn.jsdelivr.net/gh/devil-trigger/Comprehensive-applets@master/小程序其他文件/demo1.mp3'
            },
            {
                name:'黑色毛衣',
                album:'',
                singer:'周杰伦',
                cover:'https://cdn.jsdelivr.net/gh/devil-trigger/Comprehensive-applets@master/小程序其他文件/demo2.jpg',
                src:'https://cdn.jsdelivr.net/gh/devil-trigger/Comprehensive-applets@master/小程序其他文件/demo2.mp3'
            },
        ]
    },
    onLoad: function (options) {
        this.getdata();
        setNavSty((a, b) => { //轮播图适配
            // console.log(b)
            // 375*138
            let swiperH = b.windowWidth * 138 / 375 + 'px'
            this.setData({
                bannerImgHeight: swiperH
            })
            // console.log(this.data.bannerImgHeight)
        });

    },
    getdata() {
        // this.getSongDetails();//歌曲详情
        this.getSwiperlist(); //轮播图
        this.getRemdList(); //歌单
        this.getRemdSongList(); //歌曲
        netEaseAPI('album/newest').then(res => {//专辑
            // console.log(res.data.albums)
            this.setData({
                newAlbums:res.data.albums
            })
        })

    },
    getSwiperlist() { //获取轮播图数据
        netEaseAPI('banner').then(res => {
            this.setData({
                swiperList: res.data.banners
            })
        })
    },
    getRemdList() { //获取推荐歌单
        netEaseAPI('personalized?limit=10').then(res => {
            //    console.log(res.data.result[0]);
            let dataArr=res.data.result;
            dataArr.forEach((item,index)=>{
                let count=item.playCount.toString();//播放量
                if(count.length>=5){//万播放量
                    let sliceNum=count.length-4;
                    let countText=count.slice(0,sliceNum);
                    if(countText.length<3){
                        let decimal=count.slice(sliceNum,sliceNum+1);
                        // console.log(countText+'.'+decimal);
                        dataArr[index].playVolume=countText+'.'+decimal;
                    }else{
                        dataArr[index].playVolume=countText;
                    }
                    // console.log(dataArr[index]);
                }else if(count.length<5){//千播放量
                    dataArr[index].playVolume=count;
                }
            })
            this.setData({remdList:dataArr})
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
    getSongDetails(){
        netEaseAPI('song/url',{
                id:'1822297556'
        }).then(res=>{
            console.log(res.data)
        })
    },
    toSearch() { //进入搜索界面
        wx.navigateTo({url:'/pages/Subpage/MusicSubPage/SearchMusic/SearchMusic'})
    },
    toRemd(e) { //点击进入歌单
        wx.navigateTo({
            url: `/pages/Subpage/MusicSubPage/playlistsDetails/playlistsDetails?id=${e.currentTarget.dataset.id}`
        })
        // console.log(e.currentTarget.dataset.id)
    },
    //生命周期函数--监听页面初次渲染完成
    onReady: function () { },
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