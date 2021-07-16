const manage = getApp().globalData.AudioCtx;
const defaultdata = getApp().globalData.defaultList;
import {
  netEaseAPI
} from '../../../../utils/util';
Component({
  properties: {
    song:Object
  },
  data: {
    playIndex: 0, //播放歌曲对应标识
    playMode: ['单曲循环', '列表循环', '随机播放'], //播放模式
    playModeIndex: 0, //播放模式标识
    randomSwitch: false, //随机模式-开关
    randomList: [], //随机播放列表
    randomAdd: 0, //随机模式-判定是否生成
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
    SongData:[], //播放歌曲data
  },
  observers: {
    'song': function (res) {//监听
      switch (res.type) {
        case 'none'://空列表（被清空）
          this.popupClose()
          this.setData({SongData: [
            {
              name: '七柚音乐',
              al: { picUrl: '/image/music-page/disc_default.png', id: 0},
              ar: [{name: '听 ! 好音乐',id: 0}],
              src:'default.mp3'
            },
          ]})
          break;
        case 'default'://默认列表（淘汰、黑色毛衣...）
            this.setData({SongData: defaultdata});
          break;
        default://一般列表
          this.setData({ SongData:res.songs})//只赋其歌曲列表
          break;
      }

    }
  },
  methods: {
    Playerslide(e) { //底部播放器左右滑动监听
      let listIndex=0;
      if (this.data.randomSwitch) {//判断是否开启随机
          listIndex=this.data.SongData.indexOf(this.data.randomList[e.detail]);
      }else{
          listIndex=e.detail
      }
      // console.log(listIndex);
      this.setData({
        playIndex: e.detail,
        playListIndex: listIndex
      })
      this.playSong();
    },
    playSwitchFun(e) { //播放、暂停——（切换）
      let state = this.data.playerState;
      // manage.onPause(()=>{})
      // if (this.data.SongData.type=='none') return
      if (this.data.slideInfo.progressText=='00:00') {
        this.playSong();
      }
      if (state) {
        manage.pause();
      } else {
        manage.play()
      }
      this.setData({playerState: e.detail})
    },
    lastSong() { //上一首—上一首——上一首——上一首——上一首
      let num = '';
      let listindex = 0;
      switch (this.data.playModeIndex <= 1) {
        case true: //单循 || 列循
          num = this.data.playIndex;
          if (this.data.playIndex == 0) {
            num =this.data.SongData.length - 1;
          } else {
            num = this.data.playIndex - 1
          };
          listindex = num;
          break;
        default: //随机
          if (this.data.randomAdd != -this.data.randomList.length + 1) { //判断是否播完该随机列表 （播完则产生新列表）
            this.setData({
              randomAdd: this.data.randomAdd - 1
            })
            if (this.data.playIndex == 0) {
              num = this.data.randomList.length - 1;
            } else {
              num = this.data.playIndex - 1
            };
          } else {
            this.setData({
              randomList: this.toRandomList(), //生成新随机列表
              randomAdd: -1 //随机add清零
            });
            num = 3;
          }
          listindex =this.data.SongData.indexOf(this.data.randomList[num]);
          break;
      }
      manage.stop();
      this.setData({
        playIndex: num,
        playListIndex: listindex
      });
      console.log(this.data.playIndex);
      this.playSong()
    },
    nextSong() {//下一首————下一首————下一首—下一首
      let num = '';
      let listIndex = 0;
      switch (this.data.playModeIndex < 2) {
        case true: //单循 || 列循
          if (this.data.playIndex ==this.data.SongData.length - 1) {
            num = 0; //放到播放列表最后一个就跳回第一个
          } else {
            num = this.data.playIndex + 1
          }
          listIndex = num;
          break;
        default: //随机
          if (this.data.randomAdd != this.data.randomList.length - 1) { //判断是否播完该随机列表 （播完则产生新列表）
            this.setData({
              randomAdd: this.data.randomAdd + 1
            })
            if (this.data.playIndex ==this.data.SongData.length - 1) {
              num = 0;
            } else {
              num = this.data.playIndex + 1
            }
          } else {
            this.setData({
              randomList: this.toRandomList(), //生成新随机列表
              randomAdd: 1 //随机add清零
            });
            num = 1;
          }
          listIndex =this.data.SongData.indexOf(this.data.randomList[num]);
          break;
      }
      manage.stop();
      this.setData({
        playIndex: num,
        playListIndex: listIndex //播放列表标识
      });
      this.playSong();
    },
    getSongUrl(index) { //获取音乐 url
      return new Promise((resolve,rej)=>{
        netEaseAPI('song/url', {
          id:this.data.SongData[index].id
        }).then(res => {
          resolve(res)
        })
      })
    },
    playSong() { //歌曲播放—————实际运用函数;
      // if (this.data.SongData.type=='none') return
      this.setData({playerState:false})
      let song = '';
      if (this.data.playModeIndex == 2) { //判断是否是随机模式（2:随机）
        song = this.data.randomList;
      } else {
        song = this.data.SongData;
        //SongData已经处理了无数据的情况（可直接赋值）
      }
      let PlayNum = this.data.playIndex;
      // console.log(PlayNum);
      manage.title = song[PlayNum].name; //歌曲标题
      manage.epname = song[PlayNum].al.name; //专辑名称
      manage.singer = song[PlayNum].ar[0].name; //歌手名
      manage.coverImgUrl = song[PlayNum].al.picUrl; //封面图 URL
      // this.getSongUrl(song[PlayNum].id);
      setTimeout(()=>{
        manage.src = song[PlayNum].src;
        this.setData({
          playerState:true
        })
      },1200)
      manage.src = song[PlayNum].src;
      manage.currentTime = 0;
      let that = this;
      manage.onPlay(() => { //监听播放
        that.setData({
          playerState: true
        });
        that.counTimeDown(manage); //记录一次进度
      });
      manage.onPause(() => { //监听暂停
        that.setData({
          playerState: false
        });
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
            if (this.data.randomAdd != this.data.randomList.length - 1) {
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
                randomAdd: 1 //随机add清零
              });
              endNum = 1;
            }
            listIndex =this.data.SongData.indexOf(this.data.randomList[endNum]);
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
    onplayerList(e) { //打开播放列表(播放列表-弹出层) 
      this.setData({
        playerList: e.detail
      })
    },
    modeSwitch() { //模式切换 ！！！！(播放列表-弹出层) 
      switch (this.data.playModeIndex) {
        case 0:
          // let index=this.data.SongData.indexOf(this.data.randomList[num]);
          this.setData({
            playModeIndex: this.data.playModeIndex + 1,
            // playIndex:this.data.playListIndex+1,
            randomSwitch: false //随机开关
          })
          break;
        case 1:
          // let index=this.data.SongData.indexOf(this.data.randomList[num]);
          this.setData({
            playModeIndex: this.data.playModeIndex + 1,
            randomList: this.toRandomList(), //随机列表
            playIndex:0,
            randomSwitch: true//随机开关
          });
          break;
        default:
          this.setData({
            playModeIndex: 0,
            playIndex:this.data.playListIndex,
            randomSwitch: false//随机开关
          });
          break;
      }
      wx.showToast({
        title: this.data.playMode[this.data.playModeIndex],
        icon: 'none'
      })
    },
    toRandomList() { //—————生成 播放列表乱序函数
      // console.logthis.data.SongDatas.songs.length);
      let arr = null;
      if (this.data.randomSwitch) {
        arr = this.data.randomList.slice(0,this.data.SongData.length);
      } else {
        arr = this.data.SongData.slice(0,this.data.SongData.length);
      }
      let playing = arr[this.data.playIndex]; //取出正在播放的那首
      arr.splice(this.data.playIndex, 1); //删掉正在播放的那首
      let randomArr = arr.sort(() => {
        return Math.random() > 0.5 ? -1 : 1
      }); //乱序
      randomArr.unshift(playing); //将正在播放的那首放入乱序后的第一位（保持播放）
      console.log(randomArr);
      return randomArr
    },
    listSongSwitch(e) { //列表切换歌曲(播放列表-弹出层)  
      let detail = e.detail;//正序index
      let ListIndex = 0;
      if (this.data.playModeIndex <= 1) { //判断是否是随机播放
        ListIndex = detail
      } else {
        ListIndex =this.data.randomList.indexOf(this.data.SongData[detail])
      }
      this.setData({
        playListIndex: detail,//列表index
        playIndex: ListIndex//歌曲播放index
      })
      this.playSong()
    },
    showPopup(e) { //打开播放器弹出层
      this.setData({
        popupDisplay: e.detail
      })
    },
    deleteSong(e) { //删除列表歌曲(播放列表-弹出层)  
      this.triggerEvent('deleteSong', e.detail)
    },
    empty() { //清空播放列表
      this.triggerEvent('empty');
    },
    createDefault(){//产生新默认列表
      this.triggerEvent('createDefault');
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
  },

  lifetimes: {
    attached() { },
    detached() {},
  },
  options: {
    addGlobalClass: true
  }
})