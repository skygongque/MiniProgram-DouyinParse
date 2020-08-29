// pages/parse/parse.js
// import {util} from "../../utils/util.js"
const DownloadSaveFile = require('../../utils/util.js');
import {downLoadVideo} from "../../utils/download.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:"",
    result: null,
    inputValue:'',
    canIUseClipboard: wx.canIUse('setClipboardData')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.parse('https://v.douyin.com/Jr3YU9y/');
  },
  getInputValue:function(e){
    const value = e.detail.value;
    this.setData({
      url:value
    })
  },
  verifyAndRequest:function(){
    var url = this.data.url;
    // console.log(url);
    var pattern = new RegExp("(https{0,1}://.*?douyin\.com\/[a-zA-Z0-9]+)");
    if (pattern.test(url)){
      this.parse(RegExp.$1)
    }else{
      console.log("输入正确的url")
      wx.showToast({
        title: '输入url错误',
      })
    }
  },
  parse: function(url) {
    var that = this;
    wx.cloud.callFunction({
      name: "parseVideo",
      data: {
        "url": url
      },
      success(res) {
        console.log("云函数获取数据成功", res)
        that.setData({
          result: res.result
        })
      },
      fail(err) {
        console.log("云函数获取数据失败", err)
      }
    })
  },
  copyText: function() {
    console.log(this.data.result.playAddress)
    wx.setClipboardData({
    data: this.data.result.playAddress,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      },
      fail: function(){
        console.log("复制失败")
      }
    })
  },
  saveVideo: function(){
    var tempUrl = this.data.result.playAddress;
    tempUrl = tempUrl.replace('http',"https");
    console.log(tempUrl);
    downLoadVideo(tempUrl);
    // DownloadSaveFile.downloadFile("video",tempUrl)
  },
  clearText: function(){
    this.setData({
      result:null,
      inputValue:"",
      url:""
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