Component({
    properties: {
        randomSwitch:Boolean,
        playerState:Boolean,
        randomList:Array,
        song:Array,
        playIndex:Number,
        dataJson:Object
    },
    data: {  },
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
        attached(){   }
    },
    observers:{
        'dataJson':function(res) {
            // console.log(res);
        }
    },
    options: {addGlobalClass: true}
})
