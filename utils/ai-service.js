// AI服务配置
const AI_CONFIG = {
  API_KEY: '待替换',
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
};

// 获取访问令牌
async function getAccessToken() {
  try {
    const response = await wx.request({
      url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AI_CONFIG.API_KEY}&client_secret=${AI_CONFIG.SECRET_KEY}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (response.data && response.data.access_token) {
      return response.data.access_token;
    }
    throw new Error('Failed to get access token');
  } catch (error) {
    console.error('获取访问令牌失败：', error);
    throw error;
  }
}

// AI 对话服务
class AIService {
  constructor() {
    this.accessToken = null;
    this.context = []; // 存储对话上下文
  }

  // 初始化服务
  async init() {
    if (!this.accessToken) {
      this.accessToken = await getAccessToken();
    }
  }

  // 生成系统提示语
  generateSystemPrompt(userInfo) {
    return `你是一位专业的命理顾问，精通八字、五行、紫微斗数等传统命理知识，同时也懂得现代心理学和MBTI性格分析。
当前用户信息：
- 姓名：${userInfo.name}
- 出生日期：${userInfo.birthDate}
- 出生时辰：${userInfo.timeRange}
- MBTI类型：${userInfo.mbtiType}

请基于以上信息，结合传统命理与现代心理学知识，为用户提供专业的分析和建议。回答要：
1. 科学理性，避免迷信色彩
2. 积极正面，给予建设性建议
3. 结合用户MBTI特质
4. 语言亲和，易于理解
5. 答案简洁，通常不超过200字`;
  }

  // 发送消息给AI
  async sendMessage(message, userInfo) {
    try {
      await this.init();

      // 如果是新对话，添加系统提示
      if (this.context.length === 0) {
        this.context.push({
          role: 'system',
          content: this.generateSystemPrompt(userInfo)
        });
      }

      // 添加用户消息到上下文
      this.context.push({
        role: 'user',
        content: message
      });

      // 调用API
      const response = await wx.request({
        url: `${AI_CONFIG.API_URL}?access_token=${this.accessToken}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          messages: this.context,
          temperature: 0.7,
          top_p: 0.8,
          stream: false
        }
      });

      if (response.data && response.data.result) {
        // 添加AI回复到上下文
        this.context.push({
          role: 'assistant',
          content: response.data.result
        });

        // 保持上下文在合理范围内
        if (this.context.length > 10) {
          this.context = this.context.slice(-10);
        }

        return response.data.result;
      }

      throw new Error('AI response error');
    } catch (error) {
      console.error('AI服务错误：', error);
      return '抱歉，服务暂时出现问题，请稍后再试。';
    }
  }

  // 清除对话上下文
  clearContext() {
    this.context = [];
  }
}

export default new AIService();
