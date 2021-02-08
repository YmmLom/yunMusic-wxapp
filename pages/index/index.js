import request from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerlist:[],//轮播图数据
    recommendlist:[],//精心推荐数据
    toplist:[],//排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // wx.request({
    //   url: 'http://localhost:3000/banner',
    //   data:{type:2},
    //   success(res){
    //     console.log("请求成功：",res);
    //   },
    //   fail(err){
    //     console.log("请求失败：",err);
    //   }
    // })
    /* 获取轮播图数据*/
    let bannerlistdata = await request("/banner", {type:2});
    this.setData({
      bannerlist:bannerlistdata.banners,
    })
    // 获取精心推荐数据
    let recommendlistdata = await request("/personalized",{limit:10});
    this.setData({
      recommendlist:recommendlistdata.result,
    })
    //获取排行榜数据
    //需要发送5次请求 拿5个榜单
    /*前++与后++记法
    * 1.先看到的是运算符还是值
    * 2.先看到运算符就先运算再赋值
    * 3.先看到值就先赋值再运算
    */
    let index = 0;
    let resultArr = [];
    while(index<5){
      let toplistdata = await request("/top/list",{idx:index++});
      let toplistitem = {name:toplistdata.playlist.name,tracks:toplistdata.playlist.tracks.slice(0, 3)};
      resultArr.push(toplistitem)
      //不需要等待五次请求全部结束才进入页面，用户体验好 但渲染次数多
      this.setData({
        toplist:resultArr,
      })
    }
    //一次更新五个toplist内的值，发送请求数据量过大 白屏等待时间过长 影响体验
    // this.setData({
    //   toplist:resultArr,
    // })

  }, 
  torecommend(){
    wx.navigateTo({
      url:"/pages/recommendSong/recommendSong"
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})