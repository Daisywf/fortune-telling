Page({
  data: {
    userInfo: {},
    elements: [
      { name: '金', value: 80 },
      { name: '木', value: 60 },
      { name: '水', value: 40 },
      { name: '火', value: 30 },
      { name: '土', value: 50 }
    ],
    fortune: {
      career: '职业发展潜力强劲，创新思维将带来新机遇。建议在9月前把握重要决策时机，年底有望获得意外惊喜。领导力和决策力都将在实践中得到提升。',
      love: '感情运势平稳向上，单身者容易在社交场合遇到意气相投的人。已有伴侣的要注意沟通方式，避免因工作压力影响感情。',
      wealth: '财运整体向好，但需要谨慎理财。适合做长期投资规划，不适合短期投机。年中可能有意外收入，建议将部分收益用于自我提升。'
    },
    tips: {
      good: ['谈判签约', '投资理财', '开展新项目', '社交活动', '学习进修'],
      bad: ['冲动消费', '轻率决策', '激进投资', '改变现状']
    }
  },

  onLoad() {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
      this.calculateFortune();
    }
  },

  // 计算命理
  calculateFortune() {
    // TODO: 根据生辰八字和MBTI实现实际的算法
    // 目前使用示例数据
  },

  // 开始咨询
  startConsult() {
    wx.navigateTo({
      url: '/pages/chat/index'
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '我的个人命理分析',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png' // 需要添加分享图片
    };
  }
});
