import { i18n } from './i18n.js';

const API_BASE_URL = 'https://prompt-api.playwithai.fun';

export class API {
  static async getToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['token'], (result) => {
        resolve(result.token);
      });
    });
  }

  static async checkToken() {
    const token = await this.getToken();
    if (!token) {
      throw new Error(i18n.getMessage('errorTokenRequired'));
    }
    return token;
  }

  static async getFrameworks() {
    try {
      const token = await this.checkToken();
      
      console.log('Fetching frameworks...');
      const response = await fetch(`${API_BASE_URL}/api/prompts/optimize/frameworks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('Frameworks response text:', text);

      try {
        const data = JSON.parse(text);
        console.log('Frameworks response:', data);
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch frameworks');
        }
        return data.data || [];
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching frameworks:', error);
      throw error;
    }
  }

  static async optimizePrompt(prompt, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        console.log('Optimizing prompt:', prompt);
        const token = await this.checkToken();
        
        const response = await fetch(`${API_BASE_URL}/api/prompts/optimize`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputPrompt: prompt,
            businessScenario: options.businessScenario,
            optimizationFramework: options.frameworkDescription,
            outputFormat: options.outputFormat
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        console.log('Optimization response text:', text);

        try {
          const data = JSON.parse(text);
          console.log('Optimization response:', data);
          if (!data.success) {
            throw new Error(data.error || 'Failed to optimize prompt');
          }
          return data.data?.optimizedPrompt || '';
        } catch (e) {
          console.error('JSON parse error:', e);
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error(`Optimization attempt ${i + 1} failed:`, error);
        if (i === retries - 1) {
          throw error;
        }
      }
    }
  }

  static async savePrompt(prompt, optimizedPrompt) {
    try {
      console.log('Saving prompt:', { prompt, optimizedPrompt });
      const token = await this.checkToken();
      
      const response = await fetch(`${API_BASE_URL}/api/prompts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: prompt.substring(0, 50),
          tags: '[]',
          creator: 'extension_user',
          source_prompt: prompt,
          optimized_prompt: optimizedPrompt || prompt,
          is_public: 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('Save response text:', text);

      try {
        const data = JSON.parse(text);
        console.log('Save response:', data);
        if (!data.success) {
          throw new Error(data.error || 'Failed to save prompt');
        }
        return data.data;
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      throw error;
    }
  }
} 