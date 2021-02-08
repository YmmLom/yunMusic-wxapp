import Pubsub from "pubsub-js";
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:"",
    month:"",
    recommendList:[],
    index:0,//音乐下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //检查用户是否登录
    let userinfo = wx.getStorageSync('userinfo');
    if(!userinfo){
      wx.showToast({
        title:'请先登录',
        icon:"none",
        duration:2000,
        success: () => {
          //跳转至登录界面
          setTimeout(
            function(){
              wx.reLaunch({
              url:"/pages/login/login"
              });
            },2000);
        }
      })
    }



    //日期设置
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1 
    })
    //获取歌单
    this.getrecommendList();

    //获取songDetail页面发布的消息 上一首/下一首
    Pubsub.subscribe('switchType', (msg, type) => {
      let {recommendList, index} = this.data;
      if(type === 'pre'){//上一首
        index === 0 && (index = recommendList.length);
        index -= 1;
      }else{//下一首
        (index === recommendList.length - 1) && (index = -1);
        index += 1;
      }
      this.setData({
        index
      })
      // console.log(index);
      let musicId = recommendList[index].id;
      //将musicId回传给songDetail页面
      Pubsub.publish('musicId',musicId);

    })
  },
  //已经登录就获取歌单
  async getrecommendList(){
    let recommendListData = await request("/recommend/songs");
    this.setData({
      recommendList:recommendListData.recommend,
    })
  },

  //跳转至songDetail页面
  ToSongDetail(event){
    let {song, index} = event.currentTarget.dataset;
    this.setData({
      index
    });
    //路由跳转传参 
    wx.navigateTo({
      url:'/pages/songDetails/songDetails?musicId=' + song,
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