const manage = getApp().globalData.AudioCtx;
Component({
  properties: {
    song: {type: Array}
  },
  data: {
    playIndex:0,//播放歌曲对应标识
    playMode:['单曲循环','列表循环','随机播放'],//播放模式
    playModeIndex:0,//播放模式标识
    popupDisplay: true, //播放器弹出层
    playerState: false, //播放状态
    playerList: false, //播放列表弹出层
    slideInfo: { //播放长度信息
      duration: 0, //全长
      durationText: '00:00', //全长-文字
      progress: 0, //当前播放进度 ————(进度条百分比)
      progressText: '00:00', //当前播放进度-文字
    },
  },

  methods: {
    Playerslide(e){//底部播放器左右滑动监听
      // console.log(e.detail.current);
      if(e.detail.current!=this.data.playIndex){
        this.setData({
          playIndex:e.detail.current
        })
        this.playSong()
      }
    },
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
    modeSwitch(){//播放模式切换
      // console.log('切换');
      if(this.data.playModeIndex==2){
        this.setData({
          playModeIndex:0
        })
      }else{
        this.setData({
          playModeIndex:this.data.playModeIndex+1
        })
      }
      
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
      if(this.data.playIndex==0){
        wx.showToast({
          title: '达到最小值',
        });
        return
      };
      let zeroText='00:00'
      this.setData({
        'slideInfo.durationText':zeroText,
        'slideInfo.progressText':zeroText,
        'slideInfo.progress':0,
        playIndex:this.data.playIndex-1
      });
      this.playSong()
    },
    nextSong(){//下一首
      console.log('下一首');
      if(this.data.playIndex==this.properties.song.length-1){
        wx.showToast({
          title: '达到最大值',
        });
        return
      }
      let text='00:00'
      this.setData({
        'slideInfo.durationText':text,
        'slideInfo.progressText':text,
        playIndex:this.data.playIndex+1
      });
      this.playSong()
    },
    onplayerList() { //打开播放列表
      console.log('打开播放列表')
      this.setData({
        playerList: true
      })
    },
    playSong() { //切换 | 播放 ——实际运用函数;
      let song = '';
      if (this.properties.song.length!=0) {
        song = this.properties.song
      } else {
        song = {
          name:'淘汰',
          album:'',
          singer:'陈奕迅',
          cover:'http://ww1.sinaimg.cn/large/00650Xxqjw1f68ayoa8h4j30sg0lcjud.jpg',
          src:'https://cdn.jsdelivr.net/gh/devil-trigger/Comprehensive-applets@master/小程序其他文件/demo1.mp3'
        }
      }
      let PlayNum=this.data.playIndex;
      manage.title = song[PlayNum].name; //歌曲标题
      manage.epname  = song[PlayNum].album;//专辑名称
      manage.singer = song[PlayNum].singer;//歌手名
      manage.coverImgUrl = song[PlayNum].cover;//封面图 URL
      manage.src = song[PlayNum].src;
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
    deleteListSong(e){//删除列表歌曲(播放列表-弹出层)  
      console.log('删除第'+e.currentTarget.dataset.index+'号歌曲')
    },
    listSongSwitch(e){//列表切换歌曲(播放列表-弹出层)  
      console.log('切换'+e.currentTarget.dataset.index);
      this.setData({
        playIndex:e.currentTarget.dataset.index
      })
      this.playSong()
    },
  },

  lifetimes: {
    attached() {
      this.playSong();


    }, //在组件实例进入页面节点树时执行
    detached() {}, //在组件实例被从页面节点树移除时执行
  },
  options: {
    addGlobalClass: true,
  }
})