import api from '../../utils/util';
Page({
    data: {
        navigationSty: { //标题栏样式（适配）
            navBarHeight: 0,
            menuRight: 0,
            menuBotton: 0,
            menuHeight: 0
        },
        CityInfo: [],
        weatherData: {
            "obsTime": "2020-06-30T21:40+08:00",//数据观测时间
            "temp": "24",//温度
            "feelsLike": "26",//体感温度
            "icon": "101",
            "text": "多云",
            "wind360": "123",
            "windDir": "东南风",
            "windScale": "1",
            "windSpeed": "3",
            "humidity": "72",
            "precip": "0.0",
            "pressure": "1003",
            "vis": "16",
            "cloud": "10",
            "dew": "21"
        }
    },
    onLoad: function (options) {
        api.setNavSty(json=>{//设置导航栏高度
            this.setData({
                navigationSty:json
            })
        })
        // this.getWeatherData();
        // this.getCityInfo();
    },
    getLocation() { //获取经纬度
        return new Promise((resolve, reject) => {
            wx.getLocation({
                success: res => {
                    const locationJson = {
                        longitude: res.longitude, //经度
                        latitude: res.latitude, //纬度
                    }
                    //console.log(locationJson);
                    resolve(locationJson)
                },
                fail: err => {
                    if (err) {
                        wx.showToast({
                            title: '获取地理信息失败...',
                            icon: 'error'
                        })
                        reject(err)
                    }
                }
            })
        })

    },
    getCityInfo() { //获取城市信息
        this.getLocation().then((local) => {
            wx.request({
                url: 'https://geoapi.qweather.com/v2/city/lookup',
                data: {
                    key: '2ae1554cc3ef441fa327f6c11a841ca2',
                    location: local.longitude + ',' + local.latitude
                },
                success: res => {
                    console.log(res.data.location[0]);
                    if (res.data.code == 200) {
                        this.setData({
                            CityInfo: res.data.location[0]
                        })
                    }
                }
            })
        })
    },
    getWeatherData() { //获取天气数据（根据经纬度）
        this.getLocation().then((local) => {
            // console.log(local);
            wx.request({
                url: 'https://devapi.qweather.com/v7/weather/now',
                data: {
                    key: '2ae1554cc3ef441fa327f6c11a841ca2',
                    location: local.longitude + ',' + local.latitude
                },
                success(res) {
                    console.log(res.data)
                }
            })
        })

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
    onShareAppMessage: function () {}
})