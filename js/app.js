/**
 * 每日热量计算器 - 主应用逻辑
 */
(function() {
  'use strict';

  const today = () => new Date().toISOString().slice(0, 10);

  // ===== Routing =====
  let currentPage = 'dashboard';

  function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));

    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');

    const tabEl = document.querySelector(`.tab-item[data-page="${page}"]`);
    if (tabEl) tabEl.classList.add('active');

    currentPage = page;
    updateHeader(page);
    renderPage(page);
  }

  function updateHeader(page) {
    const titles = {
      profile: '个人信息',
      dashboard: '今日总览',
      food: '饮食记录',
      exercise: '运动记录',
      history: '历史趋势'
    };
    document.getElementById('headerTitle').textContent = titles[page] || '每日热量计算器';

    const subs = {
      profile: '设置你的身体数据',
      dashboard: '今日热量一览',
      food: '记录每日饮食',
      exercise: '记录运动消耗',
      history: '查看历史数据'
    };
    document.getElementById('headerSub').textContent = subs[page] || '';
  }

  function renderPage(page) {
    switch (page) {
      case 'profile': renderProfile(); break;
      case 'dashboard': renderDashboard(); break;
      case 'food': renderFood(); break;
      case 'exercise': renderExercise(); break;
      case 'history': renderHistory(); break;
    }
  }

  // ===== Profile =====
  function renderProfile() {
    const profile = Storage.getProfile();
    if (profile) {
      document.getElementById('gender').value = profile.gender || 'male';
      document.getElementById('age').value = profile.age || '';
      document.getElementById('height').value = profile.height || '';
      document.getElementById('weight').value = profile.weight || '';
      document.getElementById('goal').value = profile.goal || '增肌';
      document.getElementById('activityLevel').value = profile.activityLevel || 'light';
      document.getElementById('geminiKey').value = profile.geminiKey || '';
      calcBMR();
    }
  }

  function calcBMR() {
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const activityLevel = document.getElementById('activityLevel').value;

    const resultCard = document.getElementById('bmrResultCard');

    if (!age || !height || !weight) {
      resultCard.style.display = 'none';
      return;
    }

    const bmr = Math.round(BMR.calcBMR(gender, weight, height, age));
    const tdee = Math.round(BMR.calcTDEE(bmr, activityLevel));

    document.getElementById('bmrDisplay').textContent = bmr + ' kcal';
    document.getElementById('tdeeDisplay').innerHTML = tdee + ' <span style="font-size:14px;font-weight:400;opacity:0.8;">kcal</span>';
    resultCard.style.display = 'block';
  }

  // ===== Dashboard =====
  function renderDashboard() {
    const profile = Storage.getProfile();
    if (!profile) {
      document.querySelector('.ring-text .num').textContent = '--';
      document.getElementById('netCalDisplay').textContent = '--';
      document.getElementById('dashTdee').textContent = '--';
      document.getElementById('dashIntake').textContent = '--';
      document.getElementById('dashBurn').textContent = '--';
      document.getElementById('dashProtein').textContent = '--';
      document.getElementById('suggestionText').textContent = '请先在「个人」页面填写信息';
      return;
    }

    const date = today();
    const foods = Storage.getFoods(date);
    const exercises = Storage.getExercises(date);

    const totalIntake = foods.reduce((s, f) => s + f.calories, 0);
    const totalBurn = exercises.reduce((s, e) => s + e.calories, 0);
    const totalProtein = foods.reduce((s, f) => s + (f.protein || 0), 0);
    const net = totalIntake - totalBurn;
    const tdee = profile.tdee || 2000;
    const intakePercent = Math.min(100, Math.round((totalIntake / tdee) * 100));

    // Ring chart
    document.getElementById('ringPercent').textContent = intakePercent + '%';
    const ring = document.getElementById('ringCircle');
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (intakePercent / 100) * circumference;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = offset;

    // Net color
    const netEl = document.getElementById('netCalDisplay');
    let netColor = '';
    if (net >= 0) { netColor = 'surplus'; }
    else { netColor = 'deficit'; }
    netEl.className = 'net-value ' + netColor;
    netEl.textContent = net >= 0 ? '+' + net + ' kcal' : net + ' kcal';
    document.getElementById('netCalDesc').textContent =
      profile.goal === '增肌' ? '增肌目标：TDEE +300~500kcal' : '减肥目标：TDEE -300~500kcal';

    // Stats
    document.getElementById('dashTdee').textContent = tdee;
    document.getElementById('dashIntake').textContent = totalIntake;
    document.getElementById('dashBurn').textContent = totalBurn;
    document.getElementById('dashProtein').textContent = Math.round(totalProtein) + 'g';

    // Suggestion
    showSuggestion(profile, totalIntake, totalBurn, totalProtein, net, tdee);
  }
  function showSuggestion(profile, intake, burn, protein, net, tdee) {
    const box = document.getElementById('suggestionBox');
    const text = document.getElementById('suggestionText');
    const goal = profile.goal || '增肌';
    const surplus = net - tdee;
    const proteinRec = BMR.getProteinRecommendation(profile.weight, goal);

    let advice = '';
    if (goal === '增肌') {
      if (surplus >= 500) {
        advice = '保持热量盈余，增肌效果良好。';
      } else if (surplus >= 300) {
        advice = '热量盈余达标，适合增肌。';
      } else if (surplus >= 0) {
        advice = '热量略有盈余但不够。建议再多吃 ' + (300 - surplus) + '~' + (500 - surplus) + ' kcal。';
      } else {
        advice = '目前热量不足！增肌需要热量盈余，建议每天多吃 ' + (300 + Math.abs(surplus)) + '~' + (500 + Math.abs(surplus)) + ' kcal。';
      }

      if (protein < proteinRec.min) {
        advice += ' 蛋白质摄入不足（当前 ' + Math.round(protein) + 'g，推荐 ' + proteinRec.min + '~' + proteinRec.max + 'g），建议多吃高蛋白食物。';
      } else {
        advice += ' 蛋白质摄入达标（' + Math.round(protein) + 'g / ' + proteinRec.min + '~' + proteinRec.max + 'g），不错！';
      }
    } else {
      if (surplus <= -500) {
        advice = '热量缺口充足，减脂效果明显！注意不要过度节食。';
      } else if (surplus <= -300) {
        advice = '热量缺口达标，适合减脂。';
      } else if (surplus <= 0) {
        advice = '热量缺口不够。建议再少吃 ' + Math.abs(surplus + 300) + '~' + Math.abs(surplus + 500) + ' kcal。';
      } else {
        advice = '目前热量过剩！减脂需要热量缺口，建议减少 ' + (surplus + 300) + '~' + (surplus + 500) + ' kcal。';
      }

      if (protein < proteinRec.min) {
        advice += ' 蛋白质摄入不足（当前 ' + Math.round(protein) + 'g，推荐 ' + proteinRec.min + '~' + proteinRec.max + 'g），减脂期更要保证蛋白质。';
      } else {
        advice += ' 蛋白质摄入达标（' + Math.round(protein) + 'g / ' + proteinRec.min + '~' + proteinRec.max + 'g），保持！';
      }
    }

    box.className = 'tip-box';
    if (advice.includes('不够') || advice.includes('不足') || advice.includes('过剩') || advice.includes('缺口不够')) {
      box.classList.add('warning');
    }
    text.textContent = advice;
  }

  // ===== Food Page =====
  let currentMeal = 'breakfast';
  let selectedFood = null;

  function renderFood() {
    const date = today();
    renderMealTab(currentMeal);
    renderFoodList(date, currentMeal);
    renderFoodTotal(date);
  }

  function renderMealTab(meal) {
    document.querySelectorAll('.meal-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.meal === meal);
    });
  }

  function renderFoodList(date, mealType) {
    const container = document.getElementById('foodListContainer');
    const allFoods = Storage.getFoods(date);
    const mealFoods = allFoods.filter(f => f.mealType === mealType);

    if (mealFoods.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">🍽️</div><p>该餐次还没有记录</p></div>';
      return;
    }

    let html = '<div class="card"><div class="entry-list">';
    mealFoods.forEach(f => {
      const cal = Math.round(f.calories);
      html += '<div class="entry-item"><div class="entry-info"><div class="entry-name">' + f.name + '</div><div class="entry-detail">' + f.weight + 'g' + (f.kcalPer100g ? ' · ' + f.kcalPer100g + ' kcal/100g' : '') + '</div></div><div class="entry-cal">' + cal + ' kcal</div><div class="entry-actions"><button class="btn btn-danger btn-sm" onclick="window.deleteFoodItem(\'' + f.id + '\')">删除</button></div></div>';
    });
    html += '</div></div>';
    container.innerHTML = html;
  }

  window.deleteFoodItem = function(id) {
    Storage.deleteFood(today(), id);
    renderFood();
    if (currentPage === 'dashboard') renderDashboard();
  };

  function renderFoodTotal(date) {
    const allFoods = Storage.getFoods(date);
    const total = allFoods.reduce((s, f) => s + f.calories, 0);
    const totalProtein = allFoods.reduce((s, f) => s + (f.protein || 0), 0);
    const card = document.getElementById('foodTotalCard');
    if (total === 0) {
      card.style.display = 'none';
    } else {
      card.style.display = 'block';
      document.getElementById('foodTotalCal').textContent = Math.round(total) + ' kcal';
      document.getElementById('foodTotalProtein').textContent = Math.round(totalProtein) + 'g';
    }
  }

  function addFoodItem(name, weight, kcalPer100g, proteinPer100g, mealType) {
    const calories = (kcalPer100g * weight / 100);
    const protein = (proteinPer100g * weight / 100);
    const item = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      date: today(),
      mealType: mealType,
      name: name,
      weight: weight,
      kcalPer100g: kcalPer100g,
      calories: calories,
      protein: protein
    };
    Storage.saveFood(today(), item);
    return item;
  }
  // ===== Exercise Page =====
  function renderExercise() {
    renderExerciseSelect();
    renderExerciseList();
    renderExerciseTotal();
  }

  function renderExerciseSelect() {
    const sel = document.getElementById('exerciseSelect');
    sel.innerHTML = '<option value="">请选择...</option>';
    ExerciseDB.forEach(e => {
      sel.innerHTML += '<option value="' + e.name + '" data-met="' + e.met + '">' + e.name + ' (MET ' + e.met + ')</option>';
    });
  }

  function renderExerciseList() {
    const container = document.getElementById('exerciseListContainer');
    const exercises = Storage.getExercises(today());

    if (exercises.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">🏃</div><p>今天还没有运动记录</p></div>';
      return;
    }

    let html = '';
    exercises.forEach(e => {
      html += '<div class="card"><div class="entry-item"><div class="entry-info"><div class="entry-name">' + e.name + '</div><div class="entry-detail">' + e.duration + ' 分钟</div></div><div class="entry-cal" style="color:var(--orange-500);">' + Math.round(e.calories) + ' kcal</div><div class="entry-actions"><button class="btn btn-danger btn-sm" onclick="window.deleteExerciseItem(\'' + e.id + '\')">删除</button></div></div></div>';
    });
    container.innerHTML = html;
  }

  window.deleteExerciseItem = function(id) {
    Storage.deleteExercise(today(), id);
    renderExercise();
    if (currentPage === 'dashboard') renderDashboard();
  };

  function renderExerciseTotal() {
    const exercises = Storage.getExercises(today());
    const total = exercises.reduce((s, e) => s + e.calories, 0);
    const card = document.getElementById('exerciseTotalCard');
    if (total === 0) {
      card.style.display = 'none';
    } else {
      card.style.display = 'block';
      document.getElementById('exerciseTotalCal').textContent = Math.round(total) + ' kcal';
    }
  }

  function updateExercisePreview() {
    const sel = document.getElementById('exerciseSelect');
    const duration = parseFloat(document.getElementById('exerciseDuration').value);
    const profile = Storage.getProfile();

    if (sel.value && duration && profile) {
      const opt = sel.options[sel.selectedIndex];
      const met = parseFloat(opt.dataset.met);
      const cal = calcExerciseCalories(met, profile.weight, duration);
      document.getElementById('exerciseCalPreview').textContent = cal;
      document.getElementById('exercisePreview').style.display = 'block';
    } else {
      document.getElementById('exercisePreview').style.display = 'none';
    }
  }

  // ===== History =====
  function renderHistory() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const foodsByDate = Storage.getFoodsByDateRange(dates[0], dates[dates.length - 1]);
    const exercisesByDate = Storage.getExercisesByDateRange(dates[0], dates[dates.length - 1]);

    renderChart(dates, foodsByDate, exercisesByDate);
    renderHistoryDetail(dates, foodsByDate, exercisesByDate);
  }

  function renderChart(dates, foodsByDate, exercisesByDate) {
    const container = document.getElementById('chartBars');
    const maxVal = Math.max(100, ...dates.map(d => {
      const foods = foodsByDate[d] || [];
      const exercises = exercisesByDate[d] || [];
      return foods.reduce((s, f) => s + f.calories, 0) + exercises.reduce((s, e) => s + e.calories, 0);
    }));

    let html = '';
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    dates.forEach(d => {
      const foods = foodsByDate[d] || [];
      const exercises = exercisesByDate[d] || [];
      const intake = foods.reduce((s, f) => s + f.calories, 0);
      const burn = exercises.reduce((s, e) => s + e.calories, 0);
      const intakeH = Math.max(4, (intake / maxVal) * 130);
      const burnH = Math.max(4, (burn / maxVal) * 130);
      const label = d.slice(5);
      const dayName = dayNames[new Date(d).getDay()];

      html += '<div class="chart-col"><div class="chart-bar intake" style="height:' + intakeH + 'px;" title="摄入 ' + Math.round(intake) + ' kcal"></div><div class="chart-bar burn" style="height:' + burnH + 'px;" title="消耗 ' + Math.round(burn) + ' kcal"></div><div class="chart-label">' + label + '<br><small>周' + dayName + '</small></div></div>';
    });
    container.innerHTML = html;
  }

  function renderHistoryDetail(dates, foodsByDate, exercisesByDate) {
    const container = document.getElementById('historyDetail');
    let hasData = false;
    let html = '';

    dates.slice().reverse().forEach(d => {
      const foods = foodsByDate[d] || [];
      const exercises = exercisesByDate[d] || [];
      if (foods.length === 0 && exercises.length === 0) return;
      hasData = true;
      const intake = foods.reduce((s, f) => s + f.calories, 0);
      const burn = exercises.reduce((s, e) => s + e.calories, 0);

      html += '<div style="margin-bottom:12px;"><div style="font-weight:600;font-size:13px;color:var(--gray-600);margin-bottom:4px;">' + d + ' · 摄入 ' + Math.round(intake) + ' · 消耗 ' + Math.round(burn) + ' · 净 ' + Math.round(intake - burn) + ' kcal</div>';

      if (foods.length > 0) {
        html += '<div style="font-size:12px;color:var(--gray-500);padding-left:8px;">';
        foods.forEach(f => {
          html += '<div>🍽️ ' + f.name + ' ' + f.weight + 'g — ' + Math.round(f.calories) + ' kcal</div>';
        });
        html += '</div>';
      }
      if (exercises.length > 0) {
        html += '<div style="font-size:12px;color:var(--gray-500);padding-left:8px;margin-top:2px;">';
        exercises.forEach(e => {
          html += '<div>🏃 ' + e.name + ' ' + e.duration + 'min — ' + Math.round(e.calories) + ' kcal</div>';
        });
        html += '</div>';
      }
      html += '</div>';
    });

    container.innerHTML = hasData ? html : '<div class="empty-state"><div class="empty-icon">📊</div><p>暂无历史数据</p></div>';
  }
  // ===== Gemini / Photo =====
  let cameraStream = null;

  async function handleCameraCapture() {
    const profile = Storage.getProfile();
    if (!profile || !profile.geminiKey) {
      alert('请先在「个人」页面设置 Gemini API Key');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      cameraStream = stream;
      const video = document.getElementById('cameraVideo');
      video.srcObject = stream;
      document.getElementById('cameraModal').style.display = 'flex';
    } catch (err) {
      alert('无法打开摄像头: ' + err.message);
    }
  }

  async function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const profile = Storage.getProfile();
    if (!profile || !profile.geminiKey) {
      alert('请先设置 Gemini API Key');
      return;
    }

    const aiLoading = document.getElementById('aiLoading');
    aiLoading.style.display = 'block';

    try {
      const base64 = GeminiAPI.captureFromVideo(video);
      closeCamera();
      const result = await GeminiAPI.recognizeFood(profile.geminiKey, base64);

      if (result.name) {
        document.getElementById('foodSearch').value = result.name;
        selectedFood = {
          name: result.name,
          kcalPer100g: result.kcalPer100g,
          proteinPer100g: result.proteinPer100g || 0
        };
        document.getElementById('foodWeight').value = result.estimatedWeight || 100;
      }
    } catch (err) {
      alert('识别失败: ' + err.message);
    } finally {
      aiLoading.style.display = 'none';
    }
  }

  function closeCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      cameraStream = null;
    }
    document.getElementById('cameraModal').style.display = 'none';
  }

  async function handleUploadImage(file) {
    const profile = Storage.getProfile();
    if (!profile || !profile.geminiKey) {
      alert('请先在「个人」页面设置 Gemini API Key');
      return;
    }

    const aiLoading = document.getElementById('aiLoading');
    aiLoading.style.display = 'block';

    try {
      const base64 = await GeminiAPI.fileToBase64(file);
      const mimeType = file.type || 'image/jpeg';
      const result = await GeminiAPI.recognizeFood(profile.geminiKey, base64, mimeType);

      if (result.name) {
        document.getElementById('foodSearch').value = result.name;
        selectedFood = {
          name: result.name,
          kcalPer100g: result.kcalPer100g,
          proteinPer100g: result.proteinPer100g || 0
        };
        document.getElementById('foodWeight').value = result.estimatedWeight || 100;
      }
    } catch (err) {
      alert('识别失败: ' + err.message);
    } finally {
      aiLoading.style.display = 'none';
    }
  }

  // ===== Init & Events =====
  function init() {
    // Routing
    const hash = window.location.hash.slice(1) || 'dashboard';
    navigateTo(hash);

    window.addEventListener('hashchange', () => {
      const page = window.location.hash.slice(1) || 'dashboard';
      navigateTo(page);
    });

    // Tab clicks
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        const page = tab.dataset.page;
        window.location.hash = page;
      });
    });

    // Profile: real-time BMR calculation
    ['gender', 'age', 'height', 'weight', 'activityLevel'].forEach(id => {
      document.getElementById(id).addEventListener('change', calcBMR);
      const el = document.getElementById(id);
      if (el.tagName === 'INPUT') {
        el.addEventListener('input', calcBMR);
      }
    });

    // Profile: save
    document.getElementById('saveProfileBtn').addEventListener('click', () => {
      const gender = document.getElementById('gender').value;
      const age = parseInt(document.getElementById('age').value);
      const height = parseFloat(document.getElementById('height').value);
      const weight = parseFloat(document.getElementById('weight').value);
      const goal = document.getElementById('goal').value;
      const activityLevel = document.getElementById('activityLevel').value;
      const geminiKey = document.getElementById('geminiKey').value.trim();

      if (!age || !height || !weight) {
        alert('请填写完整的身体数据');
        return;
      }

      const bmr = Math.round(BMR.calcBMR(gender, weight, height, age));
      const tdee = Math.round(BMR.calcTDEE(bmr, activityLevel));

      Storage.saveProfile({
        gender, age, height, weight, goal, activityLevel,
        geminiKey: geminiKey || '',
        bmr, tdee, updatedAt: new Date().toISOString()
      });

      window.location.hash = 'dashboard';
    });

    // Food: autocomplete
    const foodSearch = document.getElementById('foodSearch');
    const autocomplete = document.getElementById('foodAutocomplete');

    foodSearch.addEventListener('input', () => {
      const q = foodSearch.value.trim();
      if (q.length < 1) {
        autocomplete.classList.remove('show');
        selectedFood = null;
        return;
      }

      const results = searchFoods(q);
      if (results.length === 0) {
        autocomplete.classList.remove('show');
        return;
      }

      let html = '';
      results.slice(0, 8).forEach(f => {
        html += '<div class="autocomplete-item" data-name="' + f.name + '" data-kcal="' + f.kcal + '" data-protein="' + f.protein + '"><span class="ac-name">' + f.name + '</span><span class="ac-detail">' + f.kcal + ' kcal/100g · ' + f.category + '</span></div>';
      });
      autocomplete.innerHTML = html;
      autocomplete.classList.add('show');
    });

    autocomplete.addEventListener('click', (e) => {
      const item = e.target.closest('.autocomplete-item');
      if (!item) return;
      foodSearch.value = item.dataset.name;
      selectedFood = {
        name: item.dataset.name,
        kcalPer100g: parseFloat(item.dataset.kcal),
        proteinPer100g: parseFloat(item.dataset.protein)
      };
      autocomplete.classList.remove('show');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.autocomplete-wrap')) {
        autocomplete.classList.remove('show');
      }
    });

    // Food: add
    document.getElementById('addFoodBtn').addEventListener('click', () => {
      const name = foodSearch.value.trim();
      const weight = parseFloat(document.getElementById('foodWeight').value);

      if (!name) {
        alert('请输入食物名称');
        return;
      }
      if (!weight || weight <= 0) {
        alert('请输入有效的克重');
        return;
      }

      let kcalPer100g = 0;
      let proteinPer100g = 0;
      if (selectedFood && selectedFood.name === name) {
        kcalPer100g = selectedFood.kcalPer100g;
        proteinPer100g = selectedFood.proteinPer100g;
      } else {
        const found = findFoodByName(name);
        if (found) {
          kcalPer100g = found.kcal;
          proteinPer100g = found.protein;
        }
      }

      addFoodItem(name, weight, kcalPer100g, proteinPer100g, currentMeal);

      foodSearch.value = '';
      document.getElementById('foodWeight').value = '';
      selectedFood = null;
      autocomplete.classList.remove('show');

      renderFood();
      if (currentPage === 'dashboard') renderDashboard();
    });

    // Meal tabs
    document.querySelectorAll('.meal-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        currentMeal = tab.dataset.meal;
        renderMealTab(currentMeal);
        renderFoodList(today(), currentMeal);
      });
    });

    // Exercise: preview
    document.getElementById('exerciseSelect').addEventListener('change', updateExercisePreview);
    document.getElementById('exerciseDuration').addEventListener('input', updateExercisePreview);

    // Exercise: add
    document.getElementById('addExerciseBtn').addEventListener('click', () => {
      const sel = document.getElementById('exerciseSelect');
      const duration = parseFloat(document.getElementById('exerciseDuration').value);
      const profile = Storage.getProfile();

      if (!sel.value) { alert('请选择运动类型'); return; }
      if (!duration || duration <= 0) { alert('请输入有效的运动时长'); return; }
      if (!profile) { alert('请先在「个人」页面填写信息'); return; }

      const opt = sel.options[sel.selectedIndex];
      const met = parseFloat(opt.dataset.met);
      const calories = calcExerciseCalories(met, profile.weight, duration);

      Storage.saveExercise(today(), {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        date: today(),
        name: sel.value,
        duration: duration,
        met: met,
        calories: calories
      });

      sel.value = '';
      document.getElementById('exerciseDuration').value = '';
      document.getElementById('exercisePreview').style.display = 'none';
      renderExercise();
      if (currentPage === 'dashboard') renderDashboard();
    });

    // Camera
    document.getElementById('cameraBtn').addEventListener('click', (e) => {
      e.preventDefault();
      handleCameraCapture();
    });
    document.getElementById('cameraCancel').addEventListener('click', closeCamera);
    document.getElementById('cameraCapture').addEventListener('click', capturePhoto);

    // Upload
    document.getElementById('uploadBtn').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('uploadInput').click();
    });
    document.getElementById('uploadInput').addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleUploadImage(e.target.files[0]);
        e.target.value = '';
      }
    });

    // Keyboard: Enter to add food
    document.getElementById('foodWeight').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('addFoodBtn').click();
      }
    });
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
