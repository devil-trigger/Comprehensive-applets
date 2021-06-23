import {netEaseAPI,setNavSty} from '../../utils/util';
Page({
    data: {
        navigationSty: { //标题栏样式（适配）
            navBarHeight: 0,
            menuRight: 0,
            menuBotton: 0,
            menuHeight: 0
        },
        bannerImgHeight:0,
        swiperList:[],//轮播图data
        remdList:[],//推荐歌单data
        remdSongList:[
            [
                {
                    imgUrl:'https://pic4.zhimg.com/50/v2-a436f4c1749c1127b6d4c73a74bdb2cd_720w.jpg?source=54b3c3a5',
                    songtitle:'22',
                    singer:'Taylor Swift'
                },
                {
                    imgUrl:'https://pic4.zhimg.com/50/v2-a436f4c1749c1127b6d4c73a74bdb2cd_720w.jpg?source=54b3c3a5',
                    songtitle:'22',
                    singer:'Taylor Swift'
                },
                {
                    imgUrl:'https://pic4.zhimg.com/50/v2-a436f4c1749c1127b6d4c73a74bdb2cd_720w.jpg?source=54b3c3a5',
                    songtitle:'22',
                    singer:'Taylor Swift'
                },
            ],
            [
                {
                    imgUrl:'https://pic4.zhimg.com/50/v2-a436f4c1749c1127b6d4c73a74bdb2cd_720w.jpg?source=54b3c3a5',
                    songtitle:'22',
                    singer:'Taylor Swift'
                }
            ]
        ],//随机歌曲data
    },
    onLoad: function (options) {
        this.getdata();
        setNavSty((a,b)=>{//轮播图适配
            // console.log(b)
            // 375*138
            let swiperH=b.windowWidth*138/375+'px'
            this.setData({
                bannerImgHeight:swiperH
            })
            // console.log(this.data.bannerImgHeight)
        });

    },
    getdata(){
        this.getSwiperlist();//轮播图
        this.getRemdList();//歌单
        this.getRemdSongList();//歌曲
    },
    getSwiperlist(){//获取轮播图数据
       netEaseAPI('banner').then(res=>{
        //    console.log(res.data.banners)
           this.setData({
            swiperList:res.data.banners
           })
       })
    },
    getRemdList(){//获取推荐歌单
        netEaseAPI('personalized?limit=10').then(res=>{
            //    console.log(res);
               this.setData({
                remdList:res.data.result
               })
           })
    },
    getRemdSongList(){//获取推荐歌曲
       netEaseAPI('personalized/newsong').then(res=>{
           console.log(res.data.result);
           let dataArr=[];
           res.data.result.forEach((item,index)=>{
            
           })
       })
    },
    toSearch(){//进入搜索界面
        wx.navigateTo({
          url: '/pages/Subpage/NetEaseMusic/SearchMusic/SearchMusic',
        })
    },
    toRemd(e){//点击进入歌单
         wx.navigateTo({
          url: `/pages/Subpage/NetEaseMusic/playlistsDetails/playlistsDetails?id=${e.currentTarget.dataset.id}`,
        })
        // console.log(e.currentTarget.dataset.id)
    },
//生命周期函数--监听页面初次渲染完成
    onReady: function () { },
//生命周期函数--监听页面显示
    onShow: function () { },
//生命周期函数--监听页面隐藏
    onHide: function () {   },
//生命周期函数--监听页面卸载
    onUnload: function () { },
//页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () { },
//页面上拉触底事件的处理函数
    onReachBottom: function () { },
//用户点击右上角分享
    onShareAppMessage: function () { }
})