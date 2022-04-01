import pinyin from "wl-pinyin";
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
let ChangeTime=timeString=>{
  //时间转换函数（转换成date格式）
  return new Date(timeString.replace(/\-/g, "/"))
}
let setNavSty=(callback)=>{ //设置标题栏高度
  let systemInfo = wx.getSystemInfoSync();
  let menuInfo = wx.getMenuButtonBoundingClientRect();
  let datajson = {};
  datajson.navBarHeight = (menuInfo.top - systemInfo.statusBarHeight) * 2 + menuInfo.height + systemInfo.statusBarHeight; 
  //导航栏高度
  datajson.menuBotton = menuInfo.top - systemInfo.statusBarHeight; 
  //胶囊距底部间距（保持底部间距一致）
  datajson.menuRight = systemInfo.screenWidth - menuInfo.right; 
  //胶囊距右方间距（方保持左、右间距一致）
  datajson.menuHeight = menuInfo.height;
  //胶囊高度（自定义内容可与胶囊高度保证一致）
  //console.log(datajson)
  callback(datajson,systemInfo)
}

let netEaseAPI=(URL,dataJson)=>{//网易云api
  // console.log('http://http://localhost:3000/:3000/'+URL);
  // let ipUrl='localhost'
  let ipUrl='81.71.88.145'
  return new Promise((resolve, reject)=>{
    wx.request({
      url: `http://${ipUrl}:3000/${URL}`,//本地
      data: dataJson,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if(res.statusCode==200){
          // console.log(res.data);
          resolve(res)
        }
      },
      fail:err=>{
        console.log(err);
        if(err){reject(err)}
      }
    })
  })
}

let getSongDetails=(idData) => { //获取歌曲详情(不包含url实际播放地址)
  let Idtext = ''; //  数组Obj、数字id Num
  switch (typeof (idData)) {
      case 'object':
          idData.forEach((item) => {
              Idtext += `,${item.id}`
          });
          Idtext = Idtext.substr(1)
          break;
      default:
          Idtext = idData
          break;
  }
  return new Promise((ress, rej) => {
      netEaseAPI('song/detail?', {
          ids: Idtext
      }).then(res => {
          ress(res.data)
      })
  })
}
let getDoubanData= (parameter,type)=>{//豆瓣数据请求
  return new Promise((resolve,reject)=>{
      let datajson={
          url: `http://api.coderyj.com/${type}${parameter}`,
          data: {},
          header: {'content-type': 'json'},
          success (res) { 
              resolve(res)
              // console.log(res);
          },
          fail(err){ 
              reject(err);
          }
        }
      wx.request(datajson)
  })
  
}
let tianxingAPI=(type,data)=>{
  let mykey='869941cd56fe09e14b255d12467651bd';
  let mydata=data?data:{};mydata.key=mykey;
  return new Promise((resolve,rej)=>{
      wx.request({
        url: `http://api.tianapi.com/${type}/index`,
        data: mydata,
        method: 'GET',
        success:res => {
          if (res.statusCode==200&&res.data) {
            resolve(res.data)
          }else{
            rej(res)
          }
        },
        fail: err=> {
          rej(err)
        },
      })
  })
}

module.exports={
  formatTime,
  ChangeTime,  //时间转换函数（转换成date格式）
  netEaseAPI,  //网易云api
  setNavSty,  //标题栏自定义适配
  getSongDetails,//获取歌曲详情(不包含url)
  getDoubanData,//获取豆瓣数据
  tianxingAPI:tianxingAPI,//天行api接口
  pinyin,//拼音转换插件
}
