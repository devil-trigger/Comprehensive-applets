const manage = getApp().globalData.AudioCtx;
Component({
  properties: {
    song: {
      type: Array
    },
  },
  data: {
    playIndex: 0, //播放歌曲对应标识
    playMode: ['单曲循环', '列表循环', '随机播放'], //播放模式
    playModeIndex: 0, //播放模式标识
    randomSwitch: false, //随机模式-开关
    randomList: [], //随机播放列表
    randomAdd: 0, //随机模式-判定是否生成数字
    popupDisplay: false, //打开播放器-弹出层
    playerList: false, //打开播放列表-弹出层
    playListIndex: 0, //播放列表 歌曲标识(播放列表-弹出层)
    playerState: false, //播放状态(播放|暂停)
    slideInfo: { //播放长度信息
      duration: 0, //全长
      durationText: '00:00', //全长-文字
      progress: 0, //当前播放进度 ————(进度条百分比%)
      progressText: '00:00', //当前播放进度-文字
    },
    defaultList: [{ //默认歌曲
        name: '淘汰',
        al: {
          name: '认了吧',
          picUrl: 'demo1.jpg',
          id: 0
        },
        ar: [{
            name: '陈奕迅',
            id: 0
          },
          {
            name: '周杰伦',
            id: 0
          },
        ],
        src: 'demo1.mp3'
      },
      {
        name: '黑色毛衣',
        al: {
          name: '十一月的肖邦',
          picUrl: 'demo2.jpg',
          id: 0
        },
        ar: [{
          name: '周杰伦',
          id: 0
        }],
        src: 'demo2.mp3'
      },
      {
        name: '爱上未来的你',
        al: {
          name: '时光机',
          picUrl: 'demo3.jpg',
          id: 0
        },
        ar: [{
          name: '刘瑞琦',
          id: 0
        }],
        src: 'demo3.m4a'
      },
      {
        name: '爱与诚',
        al: {
          name: '大雄',
          picUrl: 'demo4.jpg',
          id: 0
        },
        ar: [{
          name: '古巨基',
          id: 0
        }],
        src: 'demo4.mp3'
      },
    ], //随机歌曲data
    SongData: [] //播放歌曲data

  },
  observers: {
    'song': res => {
      // console.log(res.length)
    }

  },
  methods: {
    Playerslide(e) { //底部播放器左右滑动监听
      this.setData({
        playIndex: e.detail.current
      })
      this.playSong();
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
    playSwitchFun() { //播放、暂停——（切换）
      let state = this.data.playerState;
      if (state) {
        manage.pause();
      } else {
        manage.play()
        this.playSong();
      }
      this.setData({
        playerState: !state
      })
    },
    lastSong() { //————————————————————————————————————————————————上一首
      let num = '';
      let listindex = 0;
      switch (this.data.playModeIndex <= 1) {
        case true: //单循 || 列循
          num = this.data.playIndex;
          if (this.data.playIndex == 0) {
            num = this.properties.song.length - 1;
          } else {
            num = this.data.playIndex - 1
          };
          listindex = num;
          break;
        default: //随机
          if (this.data.randomAdd != -this.properties.randomList.length + 1) { //判断是否播完该随机列表 （播完则产生新列表）
            this.setData({
              randomAdd: this.data.randomAdd - 1
            })
            if (this.data.playIndex == 0) {
              num = this.properties.randomList.length - 1;
            } else {
              num = this.data.playIndex - 1
            };
          } else {
            this.setData({
              randomList: this.toRandomList(), //生成新随机列表
              randomAdd: 0 //随机add清零
            });
            num = 0;
          }
          listindex = this.properties.song.indexOf(this.properties.randomList[num]);
          break;
      }
      manage.stop();
      this.setData({
        playIndex: num,
        playListIndex: listindex
      });
      this.playSong()
    },
    nextSong() { //————————————————————————————————————————————————下一首
      let num = '';
      let listIndex = 0;
      switch (this.data.playModeIndex < 2) {
        case true: //单循 || 列循
          if (this.data.playIndex == this.properties.song.length - 1) {
            num = 0; //放到播放列表最后一个就跳回第一个
          } else {
            num = this.data.playIndex + 1
          }
          listIndex = num;
          break;
        default: //随机
          if (this.data.randomAdd != this.properties.randomList.length - 1) { //判断是否播完该随机列表 （播完则产生新列表）
            this.setData({
              randomAdd: this.data.randomAdd + 1
            })
            if (this.data.playIndex == this.properties.song.length - 1) {
              num = 0;
            } else {
              num = this.data.playIndex + 1
            }
          } else {
            this.setData({
              randomList: this.toRandomList(), //生成新随机列表
              randomAdd: 0 //随机add清零
            });
            num = 0;
          }
          listIndex = this.properties.song.indexOf(this.properties.randomList[num]);
          break;
      }
      manage.stop();
      this.setData({
        playIndex: num,
        playListIndex: listIndex //播放列表标识
      });
      this.playSong();
    },
    playSong() { //切换 | 播放 ——————————————————————————————实际运用函数;
      let song = '';
      if (this.properties.song.length != 0) {//判断是否有播放列表
        if (this.data.playModeIndex == 2) { //判断是否是随机模式（2:随机）
          song = this.properties.randomList;
        } else {
          song = this.properties.song;
        }
      }else{
          song = this.data.defaultList;
      }
      console.log(song);
      let PlayNum = this.data.playIndex;
      // console.log(PlayNum)
      manage.title = song[PlayNum].name; //歌曲标题
      manage.epname = song[PlayNum].al.name; //专辑名称
      manage.singer = song[PlayNum].ar[0].name; //歌手名
      manage.coverImgUrl = song[PlayNum].al.picUrl; //封面图 URL
      manage.src = song[PlayNum].src;
      manage.currentTime = 0;
      let that = this;
      manage.onPlay(() => { //监听播放
        that.setData({playerState: true});
        that.counTimeDown(manage); //记录一次进度
      });
      manage.onPause(() => { //监听暂停
        that.setData({playerState: false});
        that.counTimeDown(manage); //记录一次进度
      });
      manage.onEnded(() => { //监听播完停止
        console.log('停止/播完');
        let endNum = PlayNum;
        let listIndex = 0;
        switch (this.data.playModeIndex) {
          case 0: //单循
            console.log('单循');
            endNum = PlayNum;
            listIndex = endNum;
            break;
          case 1: //列循
            console.log('列循')
            if (endNum == song.length - 1) {
              endNum = 0
            } else {
              endNum += 1
            }
            listIndex = endNum;
            break;
          case 2: //随机
            if (this.data.randomAdd != this.properties.randomList.length - 1) {
              this.setData({
                randomAdd: this.data.randomAdd + 1
              })
              //判断是否播完该随机列表 （播完则产生新列表）
              if (endNum == song.length - 1) {
                endNum = 0
              } else {
                endNum += 1
              }
            } else {
              this.setData({
                randomList: this.toRandomList(), //生成新随机列表
                randomAdd: 0 //随机add清零
              });
              endNum = 0;
            }
            listIndex = this.properties.song.indexOf(this.properties.randomList[endNum]);
            //弹出层播放列表 对应 曲目
            break;
        }
        that.setData({
          playerState: false,
          playIndex: endNum,
          playListIndex: listIndex
        });
        this.playSong();
      })
      manage.onTimeUpdate(() => {
        // console.log('持续播放中');
        that.counTimeDown(manage);
      })
    },
    counTimeDown(audioCtx, updateSwitch) { //获取（更新）播放时间数据
      let songJson = {
        duration: Math.ceil(audioCtx.duration),
        durationText: this.formatTime(Math.ceil(audioCtx.duration)),
        progress: Math.floor(Math.ceil(audioCtx.currentTime) / Math.ceil(audioCtx.duration) * 100),
        progressText: this.formatTime(Math.ceil(audioCtx.currentTime)),
        progressSecond: Math.ceil(audioCtx.currentTime),
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
        'slideInfo.progressText': this.formatTime(this.data.slideInfo.duration * e.detail * 0.01)
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
    onplayerList() { //打开播放列表(播放列表-弹出层) 
      this.setData({
        playerList: true
      })
    },
    modeSwitch() { //播放 模式切换 ！！！！！！！！！！！！！！！！！(播放列表-弹出层) 
      switch (this.data.playModeIndex) {
        case 0:
          this.setData({
            playModeIndex: this.data.playModeIndex + 1,
            randomSwitch: false //随机开关
          })
          break;
        case 1:
          this.setData({
            playModeIndex: this.data.playModeIndex + 1,
            randomList: this.toRandomList(), //随机列表
            randomSwitch: true
          });
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
    toRandomList() { //——————————————————————————————————生成 播放列表乱序函数
      let arr = this.properties.song.slice(0, this.properties.song.length);
      let randomArr = arr.sort(() => {
        return Math.random() > 0.5 ? -1 : 1
      }); //乱序
      let index = randomArr.indexOf(this.properties.song[this.data.playIndex]);
      console.log(randomArr);
      if (!this.data.randomSwitch) {
        console.log('混入随机列表内', index)
        this.setData({
          playIndex: index
        })
      }
      return randomArr
    },
    deleteListSong(e) { //删除列表歌曲(播放列表-弹出层)  
      console.log('删除' + this.properties.song[e.detail].name + '歌曲')
    },
    deletePlaylist() {
      // this.setData({playerList:false})
      wx.showModal({
          cancelColor: '#000',
          title: '温馨提示',
          content: '确定清空列表？',
        })
        .then(res => {
          switch (res.confirm) {
            case true:
              console.log('确认')
              break;
            default:
              console.log('取消')
              break;
          }
        })
    },
    listSongSwitch(e) { //列表切换歌曲(播放列表-弹出层)  
      let detail = e.detail
      let ListIndex = 0;
      if (this.data.playModeIndex <= 1) { //判断是否是随机播放
        ListIndex = detail
      } else {
        ListIndex = this.properties.song.indexOf(this.properties.randomList[detail])
      }
      this.setData({
        playIndex: ListIndex,
        playListIndex: detail
      })
      this.playSong()
    },
    prohibit() {
      return true
    }, //阻止播放器弹出层下层滚动
  },

  lifetimes: {
    attached() {
      // this.playSong();
      //若song没东西，则修改默认列表内容
      let urlText = 'https://cdn.jsdelivr.net/gh/devil-trigger/Comprehensive-applets@master/otherData/'
      let defauleJson = this.data.defaultList
      this.data.defaultList.forEach((item) => {
        item.al.picUrl = urlText + item.al.picUrl;
        item.src = urlText + item.src;
      })
      this.setData({
        defaultList: defauleJson
      })
    },
    detached() {},
  },
  options: {
    addGlobalClass: true,
  }
})