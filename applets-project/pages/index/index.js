import {getDoubanData,pinyin} from '../../utils/util';
Page({
    data: {
        active:0,//tab默认index
        noDataText:'数据请求失败',
        Playing:[],//新片
        Showing:[],//口碑
        TopList:[],//北美票房
    },
// 生命周期函数--监听页面加载
    onLoad: function (options) {
        let city = wx.getStorageSync('CityInfo').adm2
        let setPinYing=pinyin.getPinyin(city)
        this.SynthesisGetDatafun(setPinYing)

    },
    SynthesisGetDatafun(address){//数据请求综合函数
        let thslocal =address.replace(/\s+/g,"");
        this.getData(`playing?city=${thslocal}`,'Playing').then(res=>{//正在上映
            // console.log(this.data.Playing);
        })
        this.getData(`showing?city=${thslocal}`,'Showing').then(res=>{//即将上映
        })
        this.getData('top250?page=0','TopList').then(res=>{//Top250
            // console.log(this.data.TopList[0])
        })
    },
    getData(parameter,setdataName){
        let that= this;
        return new Promise((resolve,rej)=>{
            getDoubanData(`/${parameter}`,'movie').then(res=>{
                let mydata=res.data.data.subject;
                if (mydata.length%2!=0) {
                    //（除单）为防止数据是单数，导致视图渲染不完整
                    mydata.pop()
                    // console.log(mydata);
                }
                if (res.data.code==200&&mydata) {
                    resolve(mydata)
                    that.setData({
                        [setdataName]:mydata
                    })
                }else{
                    rej(err)
                    wx.showToast({
                      title: '获取数据失败',
                      icon:'error'
                    })
                }
               
            }).catch(err=>{
               rej(err)
            })
        } )
    },
    onChange(event) {//标签页切换
        if (event.detail.name==2) {
            wx.showToast({
                title: `该接口数据错误`,
                icon: 'none',
              });
        }
    },
    toSearchPage(){//进入搜索
        wx.navigateTo({
          url: '/pages/Subpage/FilmSubPage/SearchFilm/SearchFilm',
        })
    },
    toFilmDetailsPage(e){//进入详情
        let id=e.currentTarget.dataset.filmid
        wx.navigateTo({
          url: `/pages/Subpage/FilmSubPage/FilmDetails/FilmDetails?id=${id}`,
        })

        console.log(id)
    },
// 生命周期函数--监听页面初次渲染完成
    onReady: function () {

    },
// 生命周期函数--监听页面显示
    onShow: function () {

    },
// 生命周期函数--监听页面隐藏
    onHide: function () {

    },
// 生命周期函数--监听页面卸载
    onUnload: function () {},
// 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () { },
// 页面上拉触底事件的处理函数
    onReachBottom: function () { },
// 用户点击右上角分享
    onShareAppMessage: function () {}
})