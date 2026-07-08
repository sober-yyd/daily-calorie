/**
 * localStorage 数据管理
 */
const Storage = {
  _prefix: 'calorie_',

  _key(key) {
    return this._prefix + key;
  },

  get(key, defaultVal = null) {
    try {
      const raw = localStorage.getItem(this._key(key));
      return raw ? JSON.parse(raw) : defaultVal;
    } catch {
      return defaultVal;
    }
  },

  set(key, value) {
    localStorage.setItem(this._key(key), JSON.stringify(value));
  },

  getProfile() {
    return this.get('profile');
  },

  saveProfile(profile) {
    this.set('profile', profile);
  },

  getFoods(date) {
    const all = this.get('foods', {});
    return all[date] || [];
  },

  saveFood(date, item) {
    const all = this.get('foods', {});
    if (!all[date]) all[date] = [];
    all[date].push(item);
    this.set('foods', all);
  },

  deleteFood(date, id) {
    const all = this.get('foods', {});
    if (all[date]) {
      all[date] = all[date].filter(f => f.id !== id);
      if (all[date].length === 0) delete all[date];
    }
    this.set('foods', all);
  },

  getExercises(date) {
    const all = this.get('exercises', {});
    return all[date] || [];
  },

  saveExercise(date, item) {
    const all = this.get('exercises', {});
    if (!all[date]) all[date] = [];
    all[date].push(item);
    this.set('exercises', all);
  },

  deleteExercise(date, id) {
    const all = this.get('exercises', {});
    if (all[date]) {
      all[date] = all[date].filter(e => e.id !== id);
      if (all[date].length === 0) delete all[date];
    }
    this.set('exercises', all);
  },

  getAllDates() {
    const foods = this.get('foods', {});
    const exercises = this.get('exercises', {});
    const dates = new Set([...Object.keys(foods), ...Object.keys(exercises)]);
    return [...dates].sort();
  },

  getFoodsByDateRange(startDate, endDate) {
    const all = this.get('foods', {});
    const result = {};
    for (const [date, items] of Object.entries(all)) {
      if (date >= startDate && date <= endDate) {
        result[date] = items;
      }
    }
    return result;
  },

  getExercisesByDateRange(startDate, endDate) {
    const all = this.get('exercises', {});
    const result = {};
    for (const [date, items] of Object.entries(all)) {
      if (date >= startDate && date <= endDate) {
        result[date] = items;
      }
    }
    return result;
  }
};
