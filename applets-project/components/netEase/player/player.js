const manage = getApp().globalData.AudioCtx;
Component({
  properties: {
    song: {
      type: Array
    },
    randomList: {
      type: Array
    }, //随机播放列表
  },
  data: {
    randomSwitch: false, //随机开关
    playIndex: 0, //播放歌曲对应标识
    playMode: ['单曲循环', '列表循环', '随机播放'], //播放模式
    playModeIndex: 0, //播放模式标识
    popupDisplay: false, //打开播放器-弹出层
    playerList: false, //打开播放列表-弹出层
    playerState: false, //播放状态(播放|暂停)
    slideInfo: { //播放长度信息
      duration: 0, //全长
      durationText: '00:00', //全长-文字
      progress: 0, //当前播放进度 ————(进度条百分比)
      progressText: '00:00', //当前播放进度-文字
    },
  },
  observers: {
    'song': res => {
      // console.log(res)
    }

  },
  methods: {
    Playerslide(e) { //底部播放器左右滑动监听
      // console.log(e.detail.current);
      if (e.detail.current != this.data.playIndex) {
        this.setData({
          playIndex: e.detail.current
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
    lastSong() { //上一首
      let num = '';
      switch (this.data.playModeIndex <= 1) {
        case true: //单循 || 列循
          num = this.data.playIndex;
          if (this.data.playIndex == 0) {
            num = this.properties.song.length - 1;
          } else {
            num = this.data.playIndex - 1
          };
          break;
        default: //随机
          num = this.data.playIndex;
          if (this.data.playIndex == 0) {
            num = this.properties.song.length - 1;
          } else {
            num = this.data.playIndex - 1
          };
          break;
      }
      this.setData({
        playIndex: num
      });
      this.playSong()
    },
    nextSong() { //下一首
      let num = '';
      switch (this.data.playModeIndex <= 1) {
        case true: //单循 || 列循
          if (this.data.playIndex == this.properties.song.length - 1) {
            num = 0;
          } else {
            num = this.data.playIndex + 1
          }
          break;
        default: //随机
          console.log('随机-下一首');
          if (this.data.randomSwitch) {
            if (this.data.playIndex == this.properties.randomList.length - 1) {
              num = 0;
            } else {
              num = this.data.playIndex + 1
            }
          }
          break;
      }
      this.setData({
        playIndex: num
      });
      this.playSong()
    },
    onplayerList() { //打开播放列表
      // console.log('打开播放列表');
      this.setData({
        playerList: true
      })
    },
    playSong() { //切换 | 播放 ——实际运用函数;
      let song = '';
      if (this.properties.song.length != 0) {
        if (this.data.playModeIndex == 2) {
          song = this.properties.randomList; //随机列表
        } else {
          song = this.properties.song; //播放列表
        }
      } else {
        song = {
          name: '淘汰',
          album: '',
          singer: '陈奕迅',
          cover: 'https://cdn.jsdelivr.net/gh/devil-trigger/Comprehensive-applets@master/小程序其他文件/demo1.jpg',
          src: 'https://cdn.jsdelivr.net/gh/devil-trigger/Comprehensive-applets@master/小程序其他文件/demo1.mp3'
        }
      }
      let PlayNum = this.data.playIndex;
      console.log(song)
      // console.log(this.properties.randomList)
      manage.title = song[PlayNum].name; //歌曲标题
      manage.epname = song[PlayNum].album; //专辑名称
      manage.singer = song[PlayNum].singer; //歌手名
      manage.coverImgUrl = song[PlayNum].cover; //封面图 URL
      manage.src = song[PlayNum].src;
      manage.currentTime = 0;
      let that = this;
      manage.onPlay(() => { //监听播放
        console.log('正在播放')
        that.setData({
          playerState: true
        });
        that.counTimeDown(manage); //记录一次进度
      });
      manage.onPause(() => { //监听暂停
        console.log('暂停了');
        that.setData({
          playerState: false
        });
        that.counTimeDown(manage); ////记录一次进度
      });
      manage.onEnded(() => { //监听播完停止
        console.log('停止/播完');
        let endNum = PlayNum;
        switch (this.data.playModeIndex) {
          case 0: //单循
            console.log('单循');
            endNum = PlayNum;
            break;
          case 1: //列循
            console.log('列循')
            if (endNum == song.length - 1) {
              endNum = 0
            } else {
              endNum += 1
            }
            break;
          case 2: //随机
            endNum = 0;
            break;
        }
        that.setData({
          playerState: false,
          playIndex: endNum
        });
        this.playSong();
      })
      manage.onTimeUpdate(() => {
        // console.log('持续播放中');
        that.counTimeDown(manage)
      })
    },
    counTimeDown(audioCtx, updateSwitch) { //获取（更新）播放时间数据
      let songJson = {
        duration: Math.ceil(audioCtx.duration),
        durationText: this.formatTime(Math.ceil(audioCtx.duration)),
        progress: Math.floor(Math.ceil(audioCtx.currentTime) / Math.ceil(audioCtx.duration) * 100),
        progressText: this.formatTime(Math.ceil(audioCtx.currentTime))
      };
      if (updateSwitch) {
        return
      } else {
        this.setData({
          slideInfo: songJson
        });
      }
      // console.log(this.data.slideInfo)

    },
    dragSlider(e) { //拖动进度条（动态改变正在播放 时间值）
      this.counTimeDown(manage, true); //不即时更新progressText
      this.setData({
        'slideInfo.progressText': this.formatTime(this.data.slideInfo.duration * e.detail.value * 0.01)
      });

    },
    changeSlider(ee) { //点击进度条 
      let changeTime = ee.detail * 0.01 * this.data.slideInfo.duration
      manage.seek(changeTime); //设置歌曲进度

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
    modeSwitch() { //播放 模式切换 (播放列表-弹出层) 
      switch (this.data.playModeIndex) {
        case 0:
          this.setData({
            playModeIndex: this.data.playModeIndex + 1,
            randomSwitch: false
          })
          break;
        case 1:
          let arr = this.properties.song;
          let randomArr = arr.sort(() => {
            return .5 - Math.random()
          });
          this.setData({
            playModeIndex: this.data.playModeIndex + 1,
            randomList: randomArr, //随机列表
            randomSwitch: true //随机开关
          });
          console.log(this.properties.randomList);
          break;
        default:
          this.setData({
            playModeIndex: 0,
            randomSwitch: false
          });
          break;
      }
      wx.showToast({
        title: this.data.playMode[this.data.playModeIndex],
        icon: 'none'
      })
    },
    deleteListSong(e) { //删除列表歌曲(播放列表-弹出层)  
      console.log('删除第' + e.currentTarget.dataset.index + '号歌曲')
    },
    listSongSwitch(e) { //列表切换歌曲(播放列表-弹出层)  
      // console.log('切换' + e.currentTarget.dataset.index);
      this.setData({
        playIndex: e.currentTarget.dataset.index
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