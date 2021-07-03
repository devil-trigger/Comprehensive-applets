Component({
    properties: {
        song: Array,
        playMode: Array,
        playerList: Boolean,
        playModeIndex: Number,
        playListIndex: Number,
        playIndex: Number,
    },

    data: {

    },
    methods: {
        prohibit() { //阻止播放器弹出层下层滚动
            return true
        },
        modeSwitch(e) { //模式切换
            this.triggerEvent('modeSwitch', e.currentTarget.dataset.index)
        },
        listSongSwitch(e) { //列表歌曲切换
            this.triggerEvent('listSongSwitch', e.currentTarget.dataset.index)
        },
        deleteListSong(e) { //列表歌曲删除
            this.triggerEvent('deleteListSong', e.currentTarget.dataset.index)
        },
        deletePlaylist(){//清空列表
            this.triggerEvent('deletePlaylist')
        },
        popupClose() {//关闭弹出层
            this.triggerEvent('popupClose')
        }
    },

    options: {
        addGlobalClass: true,
    }
})