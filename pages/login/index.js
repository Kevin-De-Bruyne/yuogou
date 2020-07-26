// pages/login/index.js
Page({
  handleGetUserInfo(e){
    // console.log(e);
    const {userInfo}=e.detail;
    wx.setStorageSync("userinfo",userInfo);
    console.log(userInfo);
    wx.navigateBack({
      delta: 1,
    });
  }

})