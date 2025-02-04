Page({
  data: {
    formData: {
      name: '',
      birthDate: '',
      timeRangeIndex: null,
      mbtiIndex: null
    },
    timeRanges: [
      '子时 (23:00-1:00)',
      '丑时 (1:00-3:00)',
      '寅时 (3:00-5:00)',
      '卯时 (5:00-7:00)',
      '辰时 (7:00-9:00)',
      '巳时 (9:00-11:00)',
      '午时 (11:00-13:00)',
      '未时 (13:00-15:00)',
      '申时 (15:00-17:00)',
      '酉时 (17:00-19:00)',
      '戌时 (19:00-21:00)',
      '亥时 (21:00-23:00)'
    ],
    mbtiTypes: [
      'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ]
  },

  // 姓名输入处理
  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value
    });
  },

  // 生日选择处理
  onBirthDateChange(e) {
    this.setData({
      'formData.birthDate': e.detail.value
    });
  },

  // 时辰选择处理
  onTimeRangeChange(e) {
    this.setData({
      'formData.timeRangeIndex': e.detail.value
    });
  },

  // MBTI类型选择处理
  onMbtiChange(e) {
    this.setData({
      'formData.mbtiIndex': e.detail.value
    });
  },

  // 跳转到MBTI测试页面
  navigateToMbti() {
    wx.navigateTo({
      url: '/pages/mbti/index'
    });
  },

  // 表单提交处理
  onSubmit() {
    const { name, birthDate, timeRangeIndex, mbtiIndex } = this.data.formData;
    
    // 验证表单
    if (!name || !birthDate || timeRangeIndex === null || mbtiIndex === null) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 检查剩余次数
    const remainingQuota = wx.getStorageSync('remainingQuota') || 2;
    if (remainingQuota <= 0) {
      wx.showModal({
        title: '提示',
        content: '免费次数已用完，是否付费继续？',
        success: (res) => {
          if (res.confirm) {
            this.showPayment();
          }
        }
      });
      return;
    }

    // 保存用户信息并跳转到结果页
    const userInfo = {
      name,
      birthDate,
      timeRange: this.data.timeRanges[timeRangeIndex],
      mbtiType: this.data.mbtiTypes[mbtiIndex]
    };
    
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('remainingQuota', remainingQuota - 1);
    
    wx.navigateTo({
      url: '/pages/fortune/result'
    });
  },

  // 显示支付选项
  showPayment() {
    wx.showActionSheet({
      itemList: ['支付 6.66 元', '支付 16.66 元', '支付 26.66 元'],
      success: (res) => {
        const amounts = [6.66, 16.66, 26.66];
        this.processPayment(amounts[res.tapIndex]);
      }
    });
  },

  // 处理支付
  processPayment(amount) {
    // TODO: 接入实际支付功能
    wx.showLoading({
      title: '处理支付'
    });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      });
    }, 1500);
  }
});
