import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:"",//搜索框默认内容
    hotList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlaceholderContent();
    this.getHotList();
  },
  //搜索框内容
  async getPlaceholderContent(){
    let Content = await request("/search/default");
    this.setData({
      placeholderContent:Content.data.showKeyword,
    })
  },
  //热搜榜数据
  async getHotList(){
    let hotListData = await request("/search/hot/detail");
    this.setData({
      hotList:hotListData.data
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