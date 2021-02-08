// pages/personal/personal.js
import request from "../../utils/request.js"
let startY = 0;//起始坐标
let moveY = 0;//移动坐标
let moveDistance = 0;//移动距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:"translateY(0)",
    coverTransition:'',
    userinfo: { },//用户信息
    playRecordList:[]//用户播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userinfo = wx.getStorageSync("userinfo");
    // console.log(userinfo);
    if(userinfo){
      this.setData({
        userinfo: JSON.parse(userinfo)
      })
      //获取用户播放记录
      this.getUserPlayRecord(this.data.userinfo.userId)
    }
  },

  async getUserPlayRecord(userId){
    let playRecordListData = await request("/user/record",{uid:userId, type:0});
    let index = 0;
    let playRecordList = playRecordListData.allData.splice(0, 10).map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      playRecordList
    })
  },


  handletouchstart(event){
    startY = event.touches[0].clientY;
    this.setData({
      coverTransition:""
    })
  },
  handletouchmove(event){
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if(moveDistance <= 0){
      return;
    }
    if(moveDistance >= 80){
      moveDistance = 80;
    }
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`,
    })
  },
  handletouchend(event){
    this.setData({
      coverTransform:"translateY(0)",
      coverTransition:"transform 0.3s linear"
    })
  },

  //跳转至登录界面的tologin
  tologin(){
    
    if(!wx.getStorageSync('userinfo')){
      wx.navigateTo({
      url: '/pages/login/login',
    })
    }
    
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