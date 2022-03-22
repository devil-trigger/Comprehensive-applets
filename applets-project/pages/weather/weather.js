import api from '../../utils/util';
Page({
    data: {
        navigationSty: { //标题栏样式（适配）
            navBarHeight: 0,
            menuRight: 0,
            menuBotton: 0,
            menuHeight: 0
        },
        reqInfo:{},//请求信息
        CityInfo: [], //城市信息
        weatherData: {},//今日
        recent:[],//24h

    },
    onLoad: function (options) {
        api.setNavSty(json => { //设置导航栏高度
            this.setData({
                navigationSty: json
            })
        })
        // this.getWeatherData();
        this.getWeatherData();
    },
    getLocation() { //获取经纬度
        return new Promise((resolve, reject) => {
            let positionInfo = wx.getStorageSync('loactionInfo')
            if (positionInfo != '') {
                resolve(positionInfo);
            } else {
                wx.getLocation({
                    success: res => {
                        const locationJson = {
                            longitude: res.longitude, //经度
                            latitude: res.latitude, //纬度
                        }
                        resolve(locationJson);
                        wx.setStorage({ //缓存信息
                            key: "loactionInfo",
                            data: locationJson
                        })
                    },
                    fail: err => {
                        if (err) {
                            wx.showToast({
                                title: '获取失败...',
                                icon: 'error'
                            })
                            reject(err)
                        }
                    }
                })
            }
        })
    },
    getCityInfo() { //Api获取城市info和id
        return new Promise((resolve, reject) => {
            let cityinfo = wx.getStorageSync('CityInfo');
            if (cityinfo != '') {
                resolve(cityinfo);
                this.setData({
                    CityInfo: cityinfo
                })
            } else {
                this.getLocation().then(res => {
                    wx.request({
                        url: 'https://geoapi.qweather.com/v2/city/lookup',
                        data: {
                            key: '2ae1554cc3ef441fa327f6c11a841ca2',
                            location: res.longitude + ',' + res.latitude
                        },
                        success: res => {
                            if (res.data.code == 200) {
                                resolve(res.data.location[0])
                                wx.setStorage({ //缓存城市信息
                                    key: "CityInfo",
                                    data: res.data.location[0]
                                })
                                this.setData({
                                    CityInfo: res.data.location[0]
                                })
                                // this.getWeatherData(res.data.location[0].id);
                            }
                        },
                        fail: err => {
                            reject(err)
                        }
                    })
                })
            }
        })
    },
    getWeatherData() { //Api获取数据 ——(今日 + 24h)
        this.getCityInfo().then(info => {
            let dataJson = {
                key: '2ae1554cc3ef441fa327f6c11a841ca2',
                location: info.id
            };
            this.setData({
                reqInfo:dataJson
            })
            // this.weatherRequest('now', dataJson).then(res => {
            //     // console.log(res);
            //     this.setData({
            //         weatherData: res.data.now
            //     })
            // })
            this.getRecent(dataJson)
        });
    },
    getRecent(dataJson){
        this.weatherRequest('24h',dataJson).then(res=>{
            res.data.hourly.forEach((item)=>{
                item.correctTime=item.fxTime.substring(11,16);//提取时间
            })
            // console.log(res.data.hourly);
            this.setData({
                recent:res.data.hourly
            })
        })
    },
    refreshRecent(){
        // console.log('刷新24h天气');
        wx.showLoading({title: '刷新中...',mask: true})
        setTimeout(() => {
            wx.hideLoading()
            this.getRecent(this.data.reqInfo);
        }, 700);
    },
    //监听页面初次渲染完成
    onReady: function () {},
    //监听页面显示
    onShow: function () {},
    //监听页面隐藏
    onHide: function () {},
    //监听页面卸载
    onUnload: function () {},
    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {},
    //页面上拉触底事件的处理函数
    onReachBottom: function () {},
    //用户点击右上角分享
    onShareAppMessage: function () {},
    weatherRequest(type, datas) { //天气统一请求函数
        return new Promise((resolve, reject) => {
            wx.request({
                url: 'https://devapi.qweather.com/v7/weather/' + type,
                data: datas,
                success: res => {
                    if (res.data.code == 200) {
                        resolve(res);
                    }else{
                        reject(err)
                    }
                },
                fail: err => {
                    reject(err)
                }
            })
        })
    }
})