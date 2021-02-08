import Pubsub from "pubsub-js";
import moment from "moment";
import request from "../../utils/request"
const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    isRerun:true,//切换上一首下一首的时候重新播放动画
    song:{},//歌曲详情
    musicId:"",
    musicLink:'',
    currentTime:'00:00',
    durationTime:'00:00',
    currentWidth:0,//实时进度条的宽度
    playMode:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //options用于接收路由跳转传的参数
    //原生小程序路由传参有长度限制
    // console.log(options.musicId);
    let musicId = options.musicId;
    this.setData({
      musicId,
    });
    // console.log(musicId);
    this.getMusicInfo(musicId);
    //判断当前页面音乐是否在播放
    if(appInstance.globalData.isPlayGlobal && appInstance.globalData.musicId === musicId){
      //修改当前音乐播放状态 
      this.setData({
        isPlay:true,
      })
    }
    // 解决用户点击下拉任务栏中的暂停播放按钮不起作用的bug
    this.BAM = wx.getBackgroundAudioManager();
    this.BAM.onPlay(() => {
      this.changeIsPlay(true);
      appInstance.globalData.musicId = musicId;
    });
    this.BAM.onPause(() => {
      this.changeIsPlay(false);
    });
    this.BAM.onStop(() => {
      this.changeIsPlay(false);
    })
    this.BAM.onEnded(() => {
      //顺序循环
      let {playMode} = this.data;
      if(!playMode){
        console.log("下一首");
        Pubsub.publish('switchType','next');
      //进度条清零
        this.setData({
        currentTime:'00:00',
        currentWidth:0,
      })
      }else {//单曲循环
        console.log("循环");
        let {musicId} = this.data;
        this.getMusicInfo(musicId);
      }
    })
    //监听背景音乐实时播放的进度
    this.BAM.onTimeUpdate(() => {
      //接收的参数单位为毫秒  要乘1000
      let currentTime = moment(this.BAM.currentTime * 1000).format('mm:ss');
      let currentWidth = this.BAM.currentTime/this.BAM.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },
  //封装改变全局播放状态的函数
  changeIsPlay(isPlay){
    this.setData({
      isPlay,//es6写法
    });
    appInstance.globalData.isPlayGlobal = isPlay; 
    },
  //获取音乐详情的回调
  async getMusicInfo(musicId){
    let songData = await request("/song/detail",{ids:musicId});
    //初始化音乐总时长
    let durationTime = moment(songData.songs[0].dt).format('mm:ss');
    this.setData({
      song:songData.songs[0],
      durationTime
    })
    //修改小程序标题栏
    wx.setNavigationBarTitle({
      title:this.data.song.name,
    })
    let musicLink = await request("/song/url",{id:musicId});
    this.setData({
      musicLink:musicLink.data[0].url,
    })
    this.BAM.coverImgUrl = this.data.song.al.picUrl
    this.BAM.title = this.data.song.name;
    this.BAM.src = this.data.musicLink;//当给了新的链接后，会自动播放，下一行的就被我注掉了
    // this.changePlay();
    this.BAM.playbackRate = 2;
  },

  // 改变播放模式
  changePlayMode(){
    let {playMode} = this.data;
    this.setData({
      playMode:!playMode,
    })
  },
  // 点击切换播放状态的回调
  changePlay(){
    let {isPlay} = this.data;
    this.setData({
      isPlay:!isPlay
    })
    this.musicControl(!isPlay);//传入修改之前的状态
  },

  //控制音乐播放暂停的功能函数
  musicControl(isPlay){
    if(isPlay){//true音乐播放   BAM=BackgroundAudioManager
      this.BAM.play();
      
    }else{
      this.BAM.pause();
    }
  },

  //切换上一首/下一首
  handleSwitch(event){
    
    //获取切换类型
    let type = event.currentTarget.id;
    this.BAM.stop();
    //重新播放胶片动画
    let {isRerun} = this.data;
    this.setData({
      isRerun:!isRerun,
    })
    //订阅来自recommend页面发布的musicId
    Pubsub.subscribe('musicId',(msg, musicId) => {
      //加载新的歌曲
      this.getMusicInfo(musicId);
      //取消订阅
      Pubsub.unsubscribe('musicId');
    } )
    //发布消息给recommendSong页面
    Pubsub.publish('switchType',type);
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