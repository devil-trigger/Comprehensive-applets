import { netEaseAPI } from '../../../../../utils/util';
Component({
    properties: {
        dataJson:Object,
        playerState: Boolean,
        playTime: Number
    },
    data: {
        lrcData: [],
        scrollTop:0
    },
    methods: {
        createLrcObj(lrcdata) { //歌词解析
            let line = lrcdata.split('\n')
            let _lrcList = []
            line.forEach((item) => {
                let time = item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
                if (time != null) {
                    let lrc = item.split(time)[1] //获取到歌词
                    let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/) //获取到时间
                    // 吧时间转换成秒
                    let time2Senconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
                    _lrcList.push({
                        lrc,
                        time: time2Senconds
                    })
                }
            })
            this.setData({
                lrcData: _lrcList
            })
            // console.log(this.data.lrcData);
        },
        updata(currentTime) {
            let lrcList = this.data.lrcData;
            // console.log(lrcList);
            if (lrcList.length == 0) {
                return
            };
            //
            // console.log(currentTime,lrcList[lrcList.length - 1].time);
            if (currentTime < lrcList[lrcList.length - 1].time) { //判断是否滚动到最大限度
                // if (currentTime<lrcList[0].time) {
                    
                // }
                // this.setData({
                //     scrollTop: currentTime*100
                // });
                // console.log('未超过');
            
            }else{
                // console.log('超过了');
            }

        },
        getlrcData(id) {
            netEaseAPI('lyric',{id:id}).then(res => {
                // console.log(res.data.lrc.lyric);
                this.createLrcObj(res.data.lrc.lyric)
            })
        }
    },
    observers: {
        'playTime': function (res) {
            this.updata(res)
            // console.log(this.data.lrcData)
        },
        'playerState': function (res) {
            switch (res) {
                case true:
                    // console.log('播放');
                    break;
                default:
                    // console.log('暂停了');
                    break;
            }
        }

    },
    lifetimes: {
        attached() {
            this.getlrcData('65528');
        },
        detached() {

        },
    },
    options: {
        addGlobalClass: true,
    }
})