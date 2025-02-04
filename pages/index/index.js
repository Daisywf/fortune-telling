Page({
  data: {
    remainingQuota: 2
  },

  onLoad() {
    // 从本地存储获取剩余次数
    const quota = wx.getStorageSync('remainingQuota') || 2;
    this.setData({
      remainingQuota: quota
    });
  },

  // 导航到命理计算页面
  navigateToFortune() {
    wx.navigateTo({
      url: '/pages/fortune/index'
    });
  },

  // 导航到MBTI测试页面
  navigateToMbti() {
    wx.navigateTo({
      url: '/pages/mbti/index'
    });
  },

  // 导航到八字五行介绍页面
  navigateToIntro() {
    wx.navigateTo({
      url: '/pages/intro/index'
    });
  }
})
