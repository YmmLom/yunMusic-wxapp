import request from '../../utils/request'
// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],//导航标签数据
    navid:'',//
    videoList:[],//视频列表数据
    videoID:'',//videoID标识
    videoTimeUpdate: [], //对应视频播放时长
    trigger:false,//下拉刷新状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getvideogrouplist();
    
    
  },

  //获取导航数据
  async getvideogrouplist(){
    let videoGroupListData = await request('/video/group/list');
    this.setData({
       videoGroupList: videoGroupListData.data.slice(0,14),
       navid:videoGroupListData.data[0].id
    });
    //调用获取视频列表数据
    this.getVideoList(this.data.navid)
  },
  //获取视频列表数据
  async getVideoList(navid){
    let videoListData = await request('/video/group',{id:navid});
    wx.hideLoading();
    let index = 0;
    let videoList = videoListData.datas.map( item => {
      item.id = index++;
      return item;
    })
    console.log(videoListData)
    this.setData({
      videoList:videoListData.datas,
      trigger:false,//关闭下拉刷新
    })
  },



  //点击切换导航的回调
  changeNav(event){
    let navid = event.currentTarget.id;
    this.setData({
      navid,
      videoList:[]
    })
    wx.showLoading({
      title:'正在加载...'
    })

    //动态获取当前导航对应的视频数据
    this.getVideoList(this.data.navid);
  },

  //点击播放/继续播放的回调
  handlePlay(event){
  /**
   * 多个视频同时播放的问题
   * 需求：
   *   1.在点击播放的事件中找到上一个播放的视频
   *   2.在播放新的视频之前关闭上一个正在播放的视频
   * 关键：
   *   1.找到上一个播放的视频实例对象
   *   2.确认当前要播放的视频和正在播放的视频不是同一个视频
   */
  let vid = event.currentTarget.id;
  this.setData({
    videoID:vid
  })
  // this.vid !== vid && this.videoContext && this.videoContext.stop();
  // this.vid = vid 因为使用了image替代视频标签 当播放其他视频时 上一个视频标签自动隐藏，这里也不需要设置暂停上一个视频暂停了
   //创建控制video标签的实例对象
  this.videoContext = wx.createVideoContext(vid)//单例模式：需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象，节省内存
  //因为video标签设置了自动播放，所以这里没有再次设置videoContext.play()
  /**判读当前视频有没有播放过，播放过就跳转至上次播放的时间 */
  let {videoTimeUpdate} = this.data;
  let videoItem = videoTimeUpdate.find( item => item.vid === vid);
  if(videoItem){
    this.videoContext.seek(videoItem.currentTime); 
  }
  },

  //监听视频播放进度的回调
  handleTimeUpdate(event){

    let videoTimeObj = {vid:event.currentTarget.id, currentTime:event.detail.currentTime}
    let {videoTimeUpdate} = this.data;
    /**
     * 判读记录视频播放时长的数组videoTimeUpdate中有无当前视频的播放记录
     *  0：没有：在数组中添加当前播放的记录
     *  1： 有： 更新当前记录的时间
     */
    let videoItem = videoTimeUpdate.find(item => item.vid === videoTimeObj.vid);
    if(videoItem){
      videoItem.currentTime = event.detail.currentTime;
    }else{
      videoTimeUpdate.push(videoTimeObj);
    }

    this.setData({
      videoTimeUpdate
    })
  },

  //监听视频播放结束的时候调用
  handleEnded(event){
    //移除当前视频播放记录的对象
    let {videoTimeUpdate} = this.data;
    // videoTimeUpdate.findIndex(item => item.vid === event.currentTarget.id) 返回下标
    videoTimeUpdate.splice(videoTimeUpdate.findIndex(item => item.vid === event.currentTarget.id),1);//删除一个
    this.setData({
      videoTimeUpdate
    })
  },


  //下拉刷新 scroll-view
  handleRefresher(){ 
    console.log("下拉刷新");
    //发请求回去最新数据
    this.getVideoList(this.data.navid);
  },

  //上拉触底回调
  handleTolower(){
    console.log("上拉触底");
    //数据分页  1：前端分页 2：后端分页
    //没有接口
    


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
    console.log("页面的下拉刷新");//不触发是因为页面没有滚动条 如果把样式里页面的长度改一改 就会有了
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("页面的上拉触底"); 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
     console.log(from);
     if(from == "menu"){
       return {
       title :"硅谷云音乐来自menu",
     }
     }else{
      return {
        title :"硅谷云音乐来自button",
      }
     }
     
  }
})