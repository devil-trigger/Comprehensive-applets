const defaultdata = getApp().globalData.defaultList;//默认歌曲数据
Component({
    properties: {
        remdSongList:Array,
        title:String,
        iconName:String
    },
    data: {list:[]},
    observers:{
        'remdSongList':function(res) {
            let dataArr = [];
            switch (res.length==0) {
                case true:
                    for (let index = 0; index < 9; index++) {
                        dataArr.push({
                            picUrl: 'https://pic4.zhimg.com/50/v2-a436f4c1749c1127b6d4c73a74bdb2cd_720w.jpg?source=54b3c3a5',
                            name: '22',
                            song:{
                                artists:[{name: "Taylor Swift"}]
                            }
                        })   
                    }
                    break;
                default:
                    dataArr=res
                    break;
            }
            let datalist = [];
            let num = 0;
            dataArr.forEach((a, index) => {
                let groupNum = index + 1;
                if (groupNum % 3 == 0) { //音乐分组
                    let count = groupNum;
                    datalist.push(dataArr.slice(num, count))
                    num = count;
                    if (datalist.length ==3) {
                        this.setData({list: datalist})
                        //  console.log(this.data.list);
                    }
                }
            })
        }
    },
    methods: {
        playSonglist(){//点击播放 该列表
            let songlist=this.properties.remdSongList;
            let datalist=songlist.length==0?defaultdata:songlist;
            this.triggerEvent('playSonglist',datalist);
        },
        playSong(e){//点击播放该首歌
            this.triggerEvent('remdplaySong',this.properties.remdSongList[e.currentTarget.dataset.index].id)
            // console.log(this.properties.remdSongList[e.currentTarget.dataset.index]);
        }
    },
    options: {addGlobalClass: true}
})
