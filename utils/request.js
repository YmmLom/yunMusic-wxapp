import config from "./config";
//发送ajax请求
export default (url,data={},method="GET") => {
  // new Promise初始化promise实例的状态为pending
   return new Promise((resolve,reject) =>{
    wx.request({
      url: config.host + url,
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U')!==-1):''
      },
      success(res){
        if(data.isLogin){
          wx.setStorage({
            key:'cookies',
            data:res.cookies
          })

        }
        // console.log("请求成功：",res);
        resolve(res.data);//修改promise的状态为成功状态resolved
      },
      fail(err){
        // console.log("请求失败：",err);
        reject(err);//修改promise的状态为失败状态rejected
      }
    })
   })
}
