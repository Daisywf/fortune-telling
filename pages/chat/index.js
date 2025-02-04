Page({
  data: {
    messages: [],
    inputValue: '',
    isTyping: false,
    remainingQuota: 2,
    isInputDisabled: false,
    inputPlaceholder: '输入您想问的问题',
    scrollToMessage: '',
    showPaymentModal: false,
    selectedAmount: null,
    paymentAmounts: [
      { amount: 6.66, desc: '小额打赏' },
      { amount: 16.66, desc: '中额打赏' },
      { amount: 26.66, desc: '大额打赏' }
    ]
  },

  onLoad() {
    // 获取剩余次数
    const quota = wx.getStorageSync('remainingQuota') || 2;
    this.setData({
      remainingQuota: quota,
      isInputDisabled: quota <= 0
    });
  },

  // 输入处理
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 发送消息
  async sendMessage() {
    if (!this.data.inputValue || this.data.isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: this.data.inputValue
    };

    // 添加用户消息
    this.setData({
      messages: [...this.data.messages, userMessage],
      inputValue: '',
      isTyping: true,
      scrollToMessage: `msg-${userMessage.id}`
    });

    // 检查剩余次数
    if (this.data.remainingQuota <= 0) {
      this.setData({
        isInputDisabled: true
      });
      return;
    }

    // 减少剩余次数
    const newQuota = this.data.remainingQuota - 1;
    this.setData({
      remainingQuota: newQuota
    });
    wx.setStorageSync('remainingQuota', newQuota);

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: this.generateAIResponse(userMessage.content)
      };

      this.setData({
        messages: [...this.data.messages, aiMessage],
        isTyping: false,
        scrollToMessage: `msg-${aiMessage.id}`,
        isInputDisabled: newQuota <= 0
      });
    }, 1500);
  },

  // 生成AI回复
  generateAIResponse(userInput) {
    // TODO: 接入实际的AI服务
    // 这里使用简单的模拟回复
    const responses = [
      '根据您的八字和MBTI特质分析，',
      '从命理角度来看，',
      '结合您的个性特点，'
    ];
    const start = responses[Math.floor(Math.random() * responses.length)];
    return start + '建议您保持当前的发展方向，同时注意在关键时刻保持冷静判断。近期会有贵人相助，可以多关注人际交往带来的机会。';
  },

  // 加载更多消息
  loadMoreMessages() {
    // TODO: 实现历史消息加载
  },

  // 显示支付选项
  showPayment() {
    this.setData({
      showPaymentModal: true
    });
  },

  // 选择支付金额
  selectAmount(e) {
    const amount = e.currentTarget.dataset.amount;
    this.setData({
      selectedAmount: amount
    });
  },

  // 关闭支付弹窗
  closePayment() {
    this.setData({
      showPaymentModal: false,
      selectedAmount: null
    });
  },

  // 处理支付
  async processPayment() {
    if (!this.data.selectedAmount) {
      wx.showToast({
        title: '请选择打赏金额',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '处理支付'
    });

    // TODO: 接入实际支付功能
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      });

      // 更新剩余次数
      const newQuota = 5; // 可以根据支付金额设置不同的次数
      this.setData({
        remainingQuota: newQuota,
        isInputDisabled: false,
        showPaymentModal: false,
        selectedAmount: null
      });
      wx.setStorageSync('remainingQuota', newQuota);
    }, 1500);
  }
});
