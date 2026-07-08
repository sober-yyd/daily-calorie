/**
 * BMR / TDEE 计算 (Mifflin-St Jeor)
 */
const BMR = {
  /**
   * 计算基础代谢率
   */
  calcBMR(gender, weight, height, age) {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  },

  /**
   * 活动系数
   */
  activityMultipliers: {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extreme: 1.9
  },

  activityLabels: {
    sedentary: '久坐不动',
    light: '轻度活动',
    moderate: '中度活动',
    active: '高度活动',
    extreme: '极度活动'
  },

  /**
   * 计算 TDEE
   */
  calcTDEE(bmr, activityLevel) {
    return bmr * (this.activityMultipliers[activityLevel] || 1.2);
  },

  /**
   * 获取增肌推荐摄入量
   */
  getBulkingRecommendation(tdee) {
    return {
      min: Math.round(tdee + 300),
      max: Math.round(tdee + 500),
      surplus: '300~500kcal'
    };
  },

  /**
   * 获取减肥推荐摄入量
   */
  getCuttingRecommendation(tdee) {
    return {
      min: Math.round(tdee - 500),
      max: Math.round(tdee - 300),
      deficit: '300~500kcal'
    };
  },

  /**
   * 获取推荐蛋白质摄入 (g)
   */
  getProteinRecommendation(weight, goal) {
    if (goal === '增肌') {
      return {
        min: Math.round(weight * 1.6),
        max: Math.round(weight * 2.2)
      };
    } else {
      return {
        min: Math.round(weight * 1.6),
        max: Math.round(weight * 2.0)
      };
    }
  }
};
