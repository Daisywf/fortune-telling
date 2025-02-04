// 引入计算器
import FortuneCalculator from '../../utils/fortune-calculator.js'

Page({
  data: {
    userInfo: {},
    elements: [],
    fortune: {
      career: '',
      love: '',
      wealth: ''
    },
    tips: {
      good: [],
      bad: []
    }
  },

  onLoad: function() {
    // 获取之前页面传递的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
      // 调用计算方法
      this.calculateFortuneResult(userInfo);
    } else {
      wx.showToast({
        title: '未获取到用户信息',
        icon: 'none'
      });
    }
  },

  // 计算命理结果
  calculateFortuneResult: function(userInfo) {
    try {
      // 创建计算器实例
      const calculator = new FortuneCalculator();
      
      // 设置用户基本信息
      calculator.setBaseInfo(
        userInfo.birthDate,
        userInfo.timeRange,
        userInfo.mbtiType
      );

      // 获取计算结果
      const result = calculator.calculateFortune();

      // 更新页面数据
      this.setData({
        // 转换五行数据为数组格式
        elements: Object.entries(result.elements).map(([name, value]) => ({
          name,
          value
        })),
        // 更新运势内容
        fortune: result.fortune,
        // 更新吉凶提示
        tips: result.tips
      });

    } catch (error) {
      console.error('计算命理结果出错：', error);
      wx.showToast({
        title: '计算结果出错',
        icon: 'none'
      });
    }
  },

  // 开始咨询
  startConsult: function() {
    wx.navigateTo({
      url: '/pages/chat/index'
    });
  },

  // 分享功能
  onShareAppMessage: function() {
    return {
      title: `${this.data.userInfo.name}的个人命理分析`,
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png' // 需要添加分享图片
    }
  },

  // 重新测算
  reCalculate: function() {
    wx.navigateBack({
      delta: 1
    });
  }
});
