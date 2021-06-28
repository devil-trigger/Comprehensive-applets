const manage = getApp().globalData.AudioCtx;
Component({
  properties: {
    song: {type: Array}
  },
  data: {
    playIndex:0,//播放歌曲对应标识
    popupDisplay: false, //播放器弹出层
    playerState: false, //播放状态
    playerList: false, //播放列表弹出层
    slideInfo: { //播放长度信息
      duration: 0, //全长
      durationText: '00:00', //全长-文字
      progress: 0, //当前进度位置 ————(进度条百分比)
      progressText: '00:00', //当前进度位置-文字
    },
  },

  methods: {
    prohibit() { //阻止播放器弹出层下层滚动
      return true
    },
    popupClose() { //关闭弹出层
      this.setData({
        popupDisplay: false,
        playerList: false
      });
    },
    showPopup() { //打开播放器弹出层
      this.setData({
        popupDisplay: true
      })
    },
    playSwitchFun() { //播放、暂停 按钮切换
      let state = this.data.playerState;
      if (state) {
        manage.pause();
      } else {
        manage.play()
      }
      this.setData({
        playerState: !state
      })
    },
    lastSong(){//上一首
      console.log('上一首');
      let zeroText='00:00'
      this.setData({
        'slideInfo.durationText':zeroText,
        'slideInfo.progressText':zeroText,
        'slideInfo.progress':0
      })
    },
    nextSong(){//下一首
      console.log('下一首');
      let text='00:00'
      this.setData({
        'slideInfo.durationText':text,
        'slideInfo.progressText':text
      })
    },
    onplayerList() { //打开播放列表
      console.log('打开播放列表')
      this.setData({
        playerList: true
      })
    },
    playSong(songUrl) { //切换 | 播放 ——实际运用函数
      // console.log(songUrl);
      let song = '';
      if (songUrl) {
        song = songUrl
      } else {
        song ={
          name:'淘汰',
          album:'',
          singer:'陈奕迅',
          cover:'http://ww1.sinaimg.cn/large/00650Xxqjw1f68ayoa8h4j30sg0lcjud.jpg',
          src:'https://cdn.jsdelivr.net/gh/devil-trigger/Comprehensive-applets@master/applets-project/image/demo.mp3'
        }
      }
      manage.title = song.name; //歌曲标题
      manage.epname  = song.album;//专辑名称
      manage.singer = song.singer;//歌手名
      manage.coverImgUrl = song.cover;//封面图 URL
      manage.src = song.src;
      manage.currentTime = 0;
      let that = this;
      manage.onPlay(()=> { //监听播放
        console.log('正在播放')
        that.setData({
          playerState: true
        });
        that.counTimeDown(manage);//记录一次进度
      });
      manage.onPause(()=>{//监听暂停
        console.log('暂停了');
        that.setData({
          playerState: false
        });
        that.counTimeDown(manage);////记录一次进度
      });
      manage.onEnded(()=>{//监听停止
        console.log('停止Stop');
        that.setData({playerState: false});
        // setTimeout(() => {
          
        // }, 1000);
      })
      manage.onTimeUpdate(()=>{
        // console.log('持续播放中');
        that.counTimeDown(manage)
      })
    },
    counTimeDown(audioCtx,updateSwitch) {//获取（更新）播放时间数据
      let songJson = {
        duration: Math.ceil(audioCtx.duration),
        durationText: this.formatTime(Math.ceil(audioCtx.duration)),
        progress: Math.floor(Math.ceil(audioCtx.currentTime)/Math.ceil(audioCtx.duration)*100),
        progressText: this.formatTime(Math.ceil(audioCtx.currentTime))
      };
      if(updateSwitch){
        return
      }else{
        this.setData({
          slideInfo: songJson
        });
      }
      // console.log(this.data.slideInfo)
      
    },
    dragSlider(e){//拖动进度条（动态改变正在播放 时间值）
      this.counTimeDown(manage,true);//不即时更新progressText
      this.setData({
        'slideInfo.progressText':this.formatTime(this.data.slideInfo.duration*e.detail.value*0.01)
      });

    },
    changeSlider(ee){//点击进度条 
      // console.log(ee.detail);
      let changeTime=ee.detail*0.01*this.data.slideInfo.duration
      manage.seek(changeTime);//设置歌曲进度

    },
    formatTime(second) { //播放时间（文字）格式化
      let times = '';
      second = Math.floor(second);
      if (second > -1) {
        let min = Math.floor(second / 60) % 60;
        let sec = second % 60;
        if (min < 10) {
          times += "0";
        }
        times += min + ":";
        if (sec < 10) {
          times += "0";
        }
        times += sec;
      }
      return times;
    },

  },

  lifetimes: {
    attached() {
      this.playSong(this.properties.song[this.data.playIndex]);


    }, //在组件实例进入页面节点树时执行
    detached() {}, //在组件实例被从页面节点树移除时执行
  },
  options: {
    addGlobalClass: true,
  }
})