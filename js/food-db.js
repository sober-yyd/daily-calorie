/**
 * 常见食物热量数据库 (每100g)
 */
const FoodDB = [
  // 主食
  { name: '白米饭', kcal: 116, protein: 2.6, category: '主食' },
  { name: '糙米饭', kcal: 111, protein: 2.5, category: '主食' },
  { name: '面条(煮)', kcal: 110, protein: 3.4, category: '主食' },
  { name: '馒头', kcal: 223, protein: 7.0, category: '主食' },
  { name: '全麦面包', kcal: 246, protein: 8.5, category: '主食' },
  { name: '白面包', kcal: 265, protein: 8.0, category: '主食' },
  { name: '燕麦片', kcal: 377, protein: 13.5, category: '主食' },
  { name: '红薯', kcal: 86, protein: 1.6, category: '主食' },
  { name: '土豆', kcal: 77, protein: 2.0, category: '主食' },
  { name: '玉米', kcal: 112, protein: 4.0, category: '主食' },
  { name: '小米粥', kcal: 46, protein: 1.4, category: '主食' },
  { name: '荞麦面', kcal: 128, protein: 5.0, category: '主食' },
  { name: '粽子', kcal: 195, protein: 4.5, category: '主食' },
  { name: '饺子(猪肉)', kcal: 240, protein: 9.0, category: '主食' },

  // 肉类
  { name: '鸡胸肉', kcal: 165, protein: 31.0, category: '肉蛋' },
  { name: '鸡腿肉', kcal: 181, protein: 20.0, category: '肉蛋' },
  { name: '鸡翅', kcal: 222, protein: 17.5, category: '肉蛋' },
  { name: '鸡蛋', kcal: 155, protein: 13.0, category: '肉蛋' },
  { name: '鸡蛋(蛋白)', kcal: 52, protein: 11.0, category: '肉蛋' },
  { name: '鸡蛋(蛋黄)', kcal: 322, protein: 15.0, category: '肉蛋' },
  { name: '瘦猪肉', kcal: 143, protein: 20.0, category: '肉蛋' },
  { name: '猪排骨', kcal: 264, protein: 18.0, category: '肉蛋' },
  { name: '牛肉(瘦)', kcal: 125, protein: 20.2, category: '肉蛋' },
  { name: '牛肉(肥瘦)', kcal: 188, protein: 19.0, category: '肉蛋' },
  { name: '羊肉(瘦)', kcal: 118, protein: 20.5, category: '肉蛋' },
  { name: '鸭肉', kcal: 240, protein: 15.5, category: '肉蛋' },
  { name: '鱼肉(草鱼)', kcal: 113, protein: 16.6, category: '肉蛋' },
  { name: '三文鱼', kcal: 208, protein: 20.4, category: '肉蛋' },
  { name: '虾仁', kcal: 93, protein: 18.6, category: '肉蛋' },
  { name: '培根', kcal: 541, protein: 12.6, category: '肉蛋' },
  { name: '火腿', kcal: 330, protein: 15.0, category: '肉蛋' },
  { name: '豆腐', kcal: 81, protein: 8.1, category: '肉蛋' },
  { name: '牛奶(全脂)', kcal: 65, protein: 3.2, category: '乳品' },
  { name: '牛奶(脱脂)', kcal: 36, protein: 3.4, category: '乳品' },
  { name: '酸奶(原味)', kcal: 72, protein: 3.5, category: '乳品' },
  { name: '奶酪', kcal: 328, protein: 25.0, category: '乳品' },

  // 蔬菜
  { name: '西兰花', kcal: 34, protein: 2.8, category: '蔬菜' },
  { name: '菠菜', kcal: 23, protein: 2.9, category: '蔬菜' },
  { name: '生菜', kcal: 15, protein: 1.4, category: '蔬菜' },
  { name: '番茄', kcal: 19, protein: 0.9, category: '蔬菜' },
  { name: '黄瓜', kcal: 15, protein: 0.7, category: '蔬菜' },
  { name: '胡萝卜', kcal: 37, protein: 1.0, category: '蔬菜' },
  { name: '白菜', kcal: 17, protein: 1.5, category: '蔬菜' },
  { name: '青菜', kcal: 14, protein: 1.4, category: '蔬菜' },
  { name: '茄子', kcal: 21, protein: 1.1, category: '蔬菜' },
  { name: '青椒', kcal: 22, protein: 1.0, category: '蔬菜' },
  { name: '洋葱', kcal: 40, protein: 1.1, category: '蔬菜' },
  { name: '蘑菇', kcal: 22, protein: 3.1, category: '蔬菜' },
  { name: '木耳', kcal: 25, protein: 1.5, category: '蔬菜' },
  { name: '海带', kcal: 13, protein: 1.2, category: '蔬菜' },

  // 水果
  { name: '苹果', kcal: 52, protein: 0.3, category: '水果' },
  { name: '香蕉', kcal: 89, protein: 1.1, category: '水果' },
  { name: '橙子', kcal: 47, protein: 0.9, category: '水果' },
  { name: '葡萄', kcal: 69, protein: 0.7, category: '水果' },
  { name: '西瓜', kcal: 30, protein: 0.6, category: '水果' },
  { name: '草莓', kcal: 32, protein: 0.7, category: '水果' },
  { name: '蓝莓', kcal: 57, protein: 0.7, category: '水果' },
  { name: '猕猴桃', kcal: 61, protein: 1.1, category: '水果' },
  { name: '芒果', kcal: 60, protein: 0.8, category: '水果' },

  // 油脂坚果
  { name: '橄榄油', kcal: 884, protein: 0, category: '油脂' },
  { name: '花生油', kcal: 884, protein: 0, category: '油脂' },
  { name: '黄油', kcal: 717, protein: 0.9, category: '油脂' },
  { name: '花生', kcal: 567, protein: 25.8, category: '坚果' },
  { name: '核桃', kcal: 654, protein: 15.2, category: '坚果' },
  { name: '杏仁', kcal: 579, protein: 21.2, category: '坚果' },
  { name: '腰果', kcal: 553, protein: 18.2, category: '坚果' },
  { name: '芝麻酱', kcal: 585, protein: 19.2, category: '坚果' },

  // 零食饮品
  { name: '巧克力', kcal: 546, protein: 4.9, category: '零食' },
  { name: '蛋糕', kcal: 347, protein: 5.3, category: '零食' },
  { name: '冰淇淋', kcal: 207, protein: 3.5, category: '零食' },
  { name: '饼干', kcal: 433, protein: 8.0, category: '零食' },
  { name: '薯片', kcal: 536, protein: 7.0, category: '零食' },
  { name: '蜂蜜', kcal: 304, protein: 0.3, category: '调味' },
  { name: '白糖', kcal: 387, protein: 0, category: '调味' },
  { name: '酱油', kcal: 53, protein: 8.0, category: '调味' },
  { name: '醋', kcal: 18, protein: 0.4, category: '调味' },

  // 汤/饮品
  { name: '豆浆', kcal: 33, protein: 2.9, category: '饮品' },
  { name: '可乐', kcal: 42, protein: 0, category: '饮品' },
  { name: '果汁', kcal: 45, protein: 0.5, category: '饮品' },
  { name: '啤酒', kcal: 43, protein: 0.5, category: '饮品' },
];

/**
 * 搜索食物（模糊匹配）
 */
function searchFoods(query) {
  if (!query || query.trim() === '') return [];
  const q = query.trim().toLowerCase();
  return FoodDB.filter(f => f.name.toLowerCase().includes(q));
}

/**
 * 根据名称精确查找
 */
function findFoodByName(name) {
  return FoodDB.find(f => f.name === name) || null;
}

/**
 * 获取所有食物分类
 */
function getFoodCategories() {
  const cats = new Set(FoodDB.map(f => f.category));
  return [...cats];
}

/**
 * 按分类获取食物
 */
function getFoodsByCategory(category) {
  return FoodDB.filter(f => f.category === category);
}
