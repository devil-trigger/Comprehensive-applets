Component({
    properties: {
        playerState:Boolean,
        playIndex:Number,
        dataJson:Object,
        slideInfo:Object,//按钮圆形进度
    },
    data: {
        gradientColor:{//环形进度按钮渐变色(待调整)
            '0%': '#d3d3d3',
            '100%': '#fff',
        }
    },
    methods: {
        showPopup() { //打开播放器弹出层
            this.triggerEvent('showPopup',true)
          },
        bindslide(e){//左右滑动监听
            this.triggerEvent('Playerslide',e.detail.current)
        },
        playSwitchFun(){//播放 | 暂停 按钮切换
            this.triggerEvent('playSwitchFun',!this.properties.playerState)
        },
        onplayerList(){//打开播放列表 弹出层
            this.triggerEvent('onplayerList',true)
        }
    },
    lifetimes:{
        attached(){
            // console.log(this.properties.slideInfo);
        }
    },
    options: {addGlobalClass: true}
})
