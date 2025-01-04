const API_BASE_URL = 'https://prompt-api.playwithai.fun';

class API {
  static async getToken() {
    const { token } = await chrome.storage.local.get('token');
    if (!token) {
      throw new Error(chrome.i18n.getMessage('errorNoToken'));
    }
    return token;
  }

  static async getFrameworks() {
    try {
      console.log('Fetching frameworks...');
      const token = await this.getToken();
      
      const response = await fetch(`${API_BASE_URL}/api/prompts/optimize/frameworks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Frameworks response:', data);
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Fetch frameworks error:', error);
      throw error;
    }
  }

  static async optimizePrompt(prompt, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        console.log('Optimizing prompt:', prompt);
        const token = await this.getToken();
        
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

        const data = await response.json();
        console.log('Optimization response:', data);
        if (!data.success) {
          throw new Error(data.error);
        }

        return data.data.optimizedPrompt;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        console.error('Optimization error:', error);
      }
    }
  }

  static async savePrompt(prompt, optimizedPrompt) {
    try {
      console.log('Saving prompt:', { prompt, optimizedPrompt });
      const token = await this.getToken();
      
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
      
      const data = await response.json();
      console.log('Save response:', data);
      if (!data.success) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    }
  }
} 