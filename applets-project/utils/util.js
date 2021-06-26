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
  // console.log('http://localhost:3000/'+URL);
  return new Promise((resolve, reject)=>{
    wx.request({
      url: 'http://192.168.1.103:3000/'+URL,//本地
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
module.exports={
  formatTime,
  ChangeTime,
  netEaseAPI,  //网易云api
  setNavSty,  //标题栏自定义适配
}
