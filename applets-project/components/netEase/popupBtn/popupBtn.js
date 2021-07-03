
Component({
    properties: {
        slideInfo:Object,
        playerState:Boolean,
    },
    data: { },
    methods: {
        changeSlider(e){//点击进度条 
            this.triggerEvent('changeSlider',e.detail)
        },
        dragSlider(e){//拖动进度条（动态改变正在播放 时间值）
            this.triggerEvent('dragSlider',e.detail.value)
        },
        lastSong(){//上一首
            this.triggerEvent('lastSong')
        },
        nextSong(){//下一首
            this.triggerEvent('nextSong')
        },
        playSwitchFun(){//播放|暂停 切换
            this.triggerEvent('playSwitchFun');
        },
    },
    options: {
        addGlobalClass: true,
      }
})
