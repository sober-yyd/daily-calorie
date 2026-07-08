/**
 * Gemini Vision API 封装
 * 使用 Gemini 2.0 Flash 模型进行食物图片识别
 */
const GeminiAPI = {
  /**
   * 调用 Gemini API 识别食物
   * @param {string} apiKey - Gemini API Key
   * @param {string} base64Image - base64 编码的图片数据
   * @param {string} mimeType - 图片 MIME 类型
   * @returns {Promise<object>} { name, kcalPer100g, estimatedWeight }
   */
  async recognizeFood(apiKey, base64Image, mimeType = 'image/jpeg') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `你是一个专业的食物识别和营养分析助手。请分析这张图片中的食物，返回JSON格式结果。

要求：
1. 识别图片中最主要的食物
2. 使用中文名称
3. 估算每100克的热量（千卡）
4. 估算图片中食物的总重量（克）

请严格按以下JSON格式返回，不要包含其他文字：
{
  "name": "食物名称",
  "kcalPer100g": 数值,
  "estimatedWeight": 数值,
  "proteinPer100g": 数值
}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          }
        ]
      }]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API 调用失败: ${response.status} ${errText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // 从响应中提取 JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法解析 Gemini 响应');
      }

      const result = JSON.parse(jsonMatch[0]);
      return {
        name: result.name || '未知食物',
        kcalPer100g: result.kcalPer100g || 0,
        estimatedWeight: result.estimatedWeight || 100,
        proteinPer100g: result.proteinPer100g || 0
      };
    } catch (error) {
      console.error('Gemini API 错误:', error);
      throw error;
    }
  },

  /**
   * 将图片文件转为 base64
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        // 移除 data:image/xxx;base64, 前缀
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * 从摄像头捕获图片转为 base64
   */
  captureFromVideo(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  }
};
