// 五行属性定义
const FIVE_ELEMENTS = {
  METAL: '金',
  WOOD: '木',
  WATER: '水',
  FIRE: '火',
  EARTH: '土'
};

// 天干对应的五行
const HEAVENLY_STEMS = {
  '甲': FIVE_ELEMENTS.WOOD,
  '乙': FIVE_ELEMENTS.WOOD,
  '丙': FIVE_ELEMENTS.FIRE,
  '丁': FIVE_ELEMENTS.FIRE,
  '戊': FIVE_ELEMENTS.EARTH,
  '己': FIVE_ELEMENTS.EARTH,
  '庚': FIVE_ELEMENTS.METAL,
  '辛': FIVE_ELEMENTS.METAL,
  '壬': FIVE_ELEMENTS.WATER,
  '癸': FIVE_ELEMENTS.WATER
};

// 地支对应的五行
const EARTHLY_BRANCHES = {
  '子': FIVE_ELEMENTS.WATER,
  '丑': FIVE_ELEMENTS.EARTH,
  '寅': FIVE_ELEMENTS.WOOD,
  '卯': FIVE_ELEMENTS.WOOD,
  '辰': FIVE_ELEMENTS.EARTH,
  '巳': FIVE_ELEMENTS.FIRE,
  '午': FIVE_ELEMENTS.FIRE,
  '未': FIVE_ELEMENTS.EARTH,
  '申': FIVE_ELEMENTS.METAL,
  '酉': FIVE_ELEMENTS.METAL,
  '戌': FIVE_ELEMENTS.EARTH,
  '亥': FIVE_ELEMENTS.WATER
};

// MBTI特质影响因子
const MBTI_FACTORS = {
  // 外向/内向影响社交运
  E: { social: 1.2, career: 1.1 },
  I: { social: 0.8, career: 0.9 },
  // 感知/直觉影响财运
  S: { wealth: 1.1, decision: 1.2 },
  N: { wealth: 0.9, decision: 0.8 },
  // 思考/情感影响事业运
  T: { career: 1.2, love: 0.8 },
  F: { career: 0.8, love: 1.2 },
  // 判断/知觉影响决策运
  J: { decision: 1.2, wealth: 1.1 },
  P: { decision: 0.8, wealth: 0.9 }
};

class FortuneCalculator {
  constructor() {
    this.solarDate = null;
    this.lunarDate = null;
    this.timeRange = null;
    this.mbtiType = null;
  }

  // 设置基础数据
  setBaseInfo(birthDate, timeRange, mbtiType) {
    this.solarDate = new Date(birthDate);
    this.timeRange = timeRange;
    this.mbtiType = mbtiType;
    this.lunarDate = this.convertToLunar(this.solarDate); // 需要实现阳历转阴历
  }

  // 计算八字
  calculateBaZi() {
    // 根据阴历日期和时辰计算八字
    // 这里需要专业的万年历库支持
    return {
      year: { stem: '甲', branch: '子' },
      month: { stem: '乙', branch: '丑' },
      day: { stem: '丙', branch: '寅' },
      hour: { stem: '丁', branch: '卯' }
    };
  }

  // 计算五行比例
  calculateElements() {
    const baZi = this.calculateBaZi();
    const elements = {
      [FIVE_ELEMENTS.METAL]: 0,
      [FIVE_ELEMENTS.WOOD]: 0,
      [FIVE_ELEMENTS.WATER]: 0,
      [FIVE_ELEMENTS.FIRE]: 0,
      [FIVE_ELEMENTS.EARTH]: 0
    };

    // 统计八字中各五行的出现次数
    Object.values(baZi).forEach(char => {
      elements[HEAVENLY_STEMS[char.stem]]++;
      elements[EARTHLY_BRANCHES[char.branch]]++;
    });

    // 计算百分比
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    Object.keys(elements).forEach(key => {
      elements[key] = Math.round((elements[key] / total) * 100);
    });

    return elements;
  }

  // 计算运势
  calculateFortune() {
    const elements = this.calculateElements();
    const mbtiFactors = this.calculateMbtiFactors();
    
    return {
      elements,
      fortune: {
        career: this.calculateCareerFortune(elements, mbtiFactors),
        love: this.calculateLoveFortune(elements, mbtiFactors),
        wealth: this.calculateWealthFortune(elements, mbtiFactors)
      },
      tips: this.generateTips(elements, mbtiFactors)
    };
  }

  // 计算MBTI影响因子
  calculateMbtiFactors() {
    const factors = {
      social: 1,
      career: 1,
      wealth: 1,
      decision: 1,
      love: 1
    };

    this.mbtiType.split('').forEach(trait => {
      const traitFactors = MBTI_FACTORS[trait];
      if (traitFactors) {
        Object.keys(traitFactors).forEach(key => {
          factors[key] *= traitFactors[key];
        });
      }
    });

    return factors;
  }

  // 计算事业运势
  calculateCareerFortune(elements, mbtiFactors) {
    const careerScore = 
      elements[FIVE_ELEMENTS.METAL] * 0.3 +
      elements[FIVE_ELEMENTS.WOOD] * 0.2 +
      elements[FIVE_ELEMENTS.WATER] * 0.2 +
      elements[FIVE_ELEMENTS.FIRE] * 0.15 +
      elements[FIVE_ELEMENTS.EARTH] * 0.15;

    const baseText = this.getCareerBaseText(careerScore);
    return this.adjustFortuneText(baseText, mbtiFactors.career);
  }

  // 计算感情运势
  calculateLoveFortune(elements, mbtiFactors) {
    const loveScore = 
      elements[FIVE_ELEMENTS.FIRE] * 0.3 +
      elements[FIVE_ELEMENTS.WATER] * 0.25 +
      elements[FIVE_ELEMENTS.WOOD] * 0.2 +
      elements[FIVE_ELEMENTS.EARTH] * 0.15 +
      elements[FIVE_ELEMENTS.METAL] * 0.1;

    const baseText = this.getLoveBaseText(loveScore);
    return this.adjustFortuneText(baseText, mbtiFactors.love);
  }

  // 计算财运
  calculateWealthFortune(elements, mbtiFactors) {
    const wealthScore = 
      elements[FIVE_ELEMENTS.METAL] * 0.35 +
      elements[FIVE_ELEMENTS.EARTH] * 0.25 +
      elements[FIVE_ELEMENTS.WATER] * 0.2 +
      elements[FIVE_ELEMENTS.WOOD] * 0.1 +
      elements[FIVE_ELEMENTS.FIRE] * 0.1;

    const baseText = this.getWealthBaseText(wealthScore);
    return this.adjustFortuneText(baseText, mbtiFactors.wealth);
  }

  // 生成吉凶提示
  generateTips(elements, mbtiFactors) {
    const dominantElement = this.getDominantElement(elements);
    const tips = {
      good: this.getGoodActivities(dominantElement, mbtiFactors),
      bad: this.getBadActivities(dominantElement, mbtiFactors)
    };

    return tips;
  }

  // 其他辅助方法...
}

export default FortuneCalculator;
