Component({
    properties: {
        song: Array,
        playMode: Array,
        playerList: Boolean,
        playModeIndex: Number,
        playListIndex: Number
    },
    data: {},
    methods: {
        prohibit() { //阻止播放器弹出层下层滚动
            return true
        },
        modeSwitch(e) { //播放模式切换
            this.triggerEvent('modeSwitch', e.currentTarget.dataset.index)
        },
        listSongSwitch(e) { //列表歌曲切换
            this.triggerEvent(`listSongSwitch`, e.currentTarget.dataset.index)
            
        },
        delete(e) { //列表歌曲删除
            this.triggerEvent(`deleteSong`, e.currentTarget.dataset.index)
        },
        empty(){//清空列表
            this.triggerEvent(`empty`);
        },
        popupClose() {//关闭弹出层
            this.triggerEvent('popupClose')
        },
        createDefault(){//生成默认列表（彩蛋）
            this.triggerEvent('createDefault')
        }
    },
    options: {
        addGlobalClass: true
    }
})