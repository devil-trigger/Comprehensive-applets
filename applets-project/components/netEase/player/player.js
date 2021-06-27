let manager = wx.getBackgroundAudioManager();
Component({
  properties: {
    song: {
      type: String
    }
  },
  data: {
    popupDisplay: false, //播放器弹出层
    playerState: false, //播放状态
    playerList: false, //播放列表弹出层
    // songInfo:{
    //   duration:0,//歌曲全长
    //   currentTime:0//当前播放长度
    // }
  },

  methods: {
    prohibit() { //阻止播放器弹出层下层滚动
      return true
    },
    popupClose() { //关闭
      this.setData({
        popupDisplay: false,
        playerList: false
      });
    },
    showPopup() { //打开
      this.setData({
        popupDisplay: true
      })
    },
    playSwitchFun() { //播放、暂停切换
      let state = this.data.playerState;
      if (state) {
        manager.pause();
      } else {
        manager.play()
        manager.onTimeUpdate(function (res) {
          // console.log(res)
        })
      }
      this.setData({
        playerState: !state
      })
    },
    onplayerList() { //打开播放列表
      console.log('打开播放列表')
      this.setData({
        playerList: true
      })
    },
    playSong(songUrl){//切换 | 播放
      let song='';
      if(songUrl){
        song=songUrl
      }else{
        song="https://sharefs.yun.kugou.com/202106270944/211dee635bc98ef82ec15b60cfbb2f0c/KGTX/CLTX001/30285fe6c09e512a339252689288a0e0.mp3"
      }
      manager.src = song;
      manager.title = '淘汰';
    }
  },
  
  lifetimes: {
    attached() {
      // console.log(manager)
      // this.playSong()

    }, //在组件实例进入页面节点树时执行
    detached() {}, //在组件实例被从页面节点树移除时执行
  },
  options: {
    addGlobalClass: true,
  }
})