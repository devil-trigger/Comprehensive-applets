import utils from './utils/util.js'
App({
  async onLaunch() {
    this.globalData.clickTime = utils.formatTime(new Date()); //储存打开小程序时间（头条）

    this.globalData.AudioCtx = wx.getBackgroundAudioManager(); //定义播放器方法


  },
  globalData: {
    clickTime: 0, //打开小程序的时间
    AudioCtx: null, //播放器方法
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
        src: 'demo1.mp3',
        id: 65528
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
        src: 'demo2.mp3',
        id: 185908
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
        src: 'demo3.m4a',
        id: 1475308845
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
        src: 'demo4.mp3',
        id: 86503
      },
    ]
  }
})