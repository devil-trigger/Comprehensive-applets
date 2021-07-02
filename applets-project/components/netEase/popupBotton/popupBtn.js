const manage = getApp().globalData.AudioCtx;
Component({
    properties: {
        playerState: Boolean,
        slideInfo: Object
    },
    data: {

    },
    methods: {
        changeSlider(ee) { //进度条——点击
            let changeTime = ee.detail * 0.01 * this.data.slideInfo.duration
            manage.seek(changeTime); //设置歌曲进度
        },
        dragSlider(e) { //进度条——拖动（动态改变正在播放 时间值）
            this.counTimeDown(manage, true); //不即时更新progressText
            this.setData({
                'slideInfo.progressText': this.formatTime(this.data.slideInfo.duration * e.detail.value * 0.01)
            });
        },
        playSwitchFun() { //播放 | 暂停 按钮切换
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
        lastSong() { //———————————上一首
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
                if (this.data.randomAdd != -this.properties.randomList.length+1) { //判断是否播完该随机列表 （播完则产生新列表）
                  this.setData({randomAdd: this.data.randomAdd - 1})
                  if (this.data.playIndex == 0) {
                    num = this.properties.randomList.length - 1;
                  } else {
                    num = this.data.playIndex - 1
                  };
                } else {
                  this.setData({
                    randomList: this.toRandomList(), //生成新随机列表
                    randomAdd:0//随机add清零
                  });
                  num=0;
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
          nextSong() { //———————————下一首
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
                if (this.data.randomAdd != this.properties.randomList.length-1) { //判断是否播完该随机列表 （播完则产生新列表）
                  this.setData({randomAdd: this.data.randomAdd + 1})
                  if (this.data.playIndex == this.properties.song.length - 1) {
                    num = 0;
                  } else {
                    num = this.data.playIndex + 1
                  }
                } else {
                  this.setData({
                    randomList: this.toRandomList(),//生成新随机列表
                    randomAdd:0//随机add清零
                  });
                  num=0;
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

    },
    options: {
        addGlobalClass: true,
    }
})