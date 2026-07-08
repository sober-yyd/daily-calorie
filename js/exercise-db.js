/**
 * 常见运动 MET 值及消耗计算
 *
 * 消耗热量(kcal) = MET × 体重(kg) × 时长(小时)
 */
const ExerciseDB = [
  { name: '走路(慢速)', met: 2.5, category: '有氧' },
  { name: '走路(正常)', met: 3.5, category: '有氧' },
  { name: '快走', met: 4.3, category: '有氧' },
  { name: '慢跑', met: 7.0, category: '有氧' },
  { name: '跑步(8km/h)', met: 8.0, category: '有氧' },
  { name: '跑步(10km/h)', met: 9.8, category: '有氧' },
  { name: '跑步(12km/h)', met: 11.5, category: '有氧' },
  { name: '爬楼梯', met: 5.0, category: '有氧' },
  { name: '骑自行车(慢)', met: 4.0, category: '有氧' },
  { name: '骑自行车(中速)', met: 7.5, category: '有氧' },
  { name: '骑自行车(快)', met: 10.0, category: '有氧' },
  { name: '游泳(自由泳)', met: 8.0, category: '有氧' },
  { name: '游泳(蛙泳)', met: 7.0, category: '有氧' },
  { name: '跳绳', met: 10.0, category: '有氧' },
  { name: '椭圆机', met: 6.0, category: '有氧' },
  { name: '划船机', met: 7.0, category: '有氧' },
  { name: 'HIIT(高强度间歇)', met: 12.0, category: '有氧' },
  { name: '跳舞', met: 5.0, category: '有氧' },

  { name: '举重(中低强度)', met: 4.0, category: '力量' },
  { name: '举重(高强度)', met: 6.0, category: '力量' },
  { name: '俯卧撑', met: 4.0, category: '力量' },
  { name: '引体向上', met: 5.0, category: '力量' },
  { name: '深蹲', met: 5.0, category: '力量' },
  { name: '瑜伽', met: 3.0, category: '柔韧' },
  { name: '普拉提', met: 4.0, category: '柔韧' },
  { name: '拉伸', met: 2.5, category: '柔韧' },

  { name: '羽毛球', met: 5.5, category: '球类' },
  { name: '篮球', met: 6.5, category: '球类' },
  { name: '足球', met: 7.0, category: '球类' },
  { name: '乒乓球', met: 4.0, category: '球类' },
  { name: '网球', met: 7.3, category: '球类' },
  { name: '排球', met: 4.5, category: '球类' },
  { name: '拳击(打沙袋)', met: 8.0, category: '搏击' },
  { name: '太极拳', met: 3.0, category: '传统' },
  { name: '徒步', met: 5.5, category: '户外' },
];

/**
 * 计算运动消耗热量
 */
function calcExerciseCalories(met, weight, durationMin) {
  return Math.round(met * weight * (durationMin / 60));
}

/**
 * 搜索运动
 */
function searchExercises(query) {
  if (!query || query.trim() === '') return ExerciseDB;
  const q = query.trim().toLowerCase();
  return ExerciseDB.filter(e => e.name.toLowerCase().includes(q));
}

/**
 * 根据名称查找运动
 */
function findExerciseByName(name) {
  return ExerciseDB.find(e => e.name === name) || null;
}

/**
 * 获取运动分类
 */
function getExerciseCategories() {
  const cats = new Set(ExerciseDB.map(e => e.category));
  return [...cats];
}

/**
 * 按分类获取运动
 */
function getExercisesByCategory(category) {
  return ExerciseDB.filter(e => e.category === category);
}
