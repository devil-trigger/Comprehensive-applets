const audioCtx = wx.createInnerAudioContext();
Component({
  properties: {
    song:{
      type:String
    }
  },
  data: {
    popupDisplay:false,//播放器弹出层
    playerState:false,//播放状态
    playerList:true,//播放列表弹出层
    // songInfo:{
    //   duration:0,//歌曲全长
    //   currentTime:0//当前播放长度
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    prohibit(){//阻止播放器弹出层下层滚动
      return true
  },
    popupClose() {//关闭
      this.setData({ popupDisplay:false,playerList:false });
    },
    showPopup(){//打开
      this.setData({
          popupDisplay:true
      })
  },
  playSwitchFun(){//播放、暂停切换
    let state=this.data.playerState;
    if(state){
      audioCtx.pause();
    }else{
      audioCtx.play()
      audioCtx.onTimeUpdate(function(res){
        // console.log(res)
      })
    }
    this.setData({
      playerState:!state
    })
  },
  onplayerList(){//打开播放列表
    console.log('打开播放列表')
    this.setData({
      playerList:true
    })
  }
  },
  lifetimes:{
    attached(){
      // console.log(audioCtx)
      audioCtx.src=this.properties.song;

      console.log(audioCtx)
    },  //在组件实例进入页面节点树时执行
    detached(){},  //在组件实例被从页面节点树移除时执行
},
  options: {
    addGlobalClass: true,
  }
})
