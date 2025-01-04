document.addEventListener('DOMContentLoaded', async () => {
  // Get elements
  const languageSelect = document.getElementById('language');
  const tokenInput = document.getElementById('token');
  const generateTokenBtn = document.getElementById('generateTokenBtn');
  const saveBtn = document.getElementById('saveBtn');
  const viewProfileBtn = document.getElementById('viewProfileBtn');

  console.log('Options page loaded');

  // 获取当前语言
  const getCurrentLanguage = async () => {
    const { language = 'en' } = await chrome.storage.local.get('language');
    return language;
  };

  // Function to update all text content
  const updateTextContent = () => {
    console.log('Updating text content with language:', document.documentElement.lang);
    document.getElementById('extensionTitle').textContent = chrome.i18n.getMessage('extensionName');
    document.getElementById('extensionDesc').textContent = chrome.i18n.getMessage('extensionDescription');
    document.querySelector('#languageLabel span:last-child').textContent = chrome.i18n.getMessage('languageLabel');
    document.querySelector('#tokenLabel span:last-child').textContent = chrome.i18n.getMessage('tokenLabel');
    document.querySelector('#saveBtn span:last-child').textContent = chrome.i18n.getMessage('saveSettings');
    document.querySelector('#viewProfileBtn span:last-child').textContent = chrome.i18n.getMessage('viewProfile');
  };

  // Load saved settings
  const { language = 'en', token } = await chrome.storage.local.get(['language', 'token']);
  console.log('Loaded settings:', { language, token });
  
  // 如果没有设置语言，使用浏览器语言
  if (!language) {
    const browserLang = chrome.i18n.getUILanguage().toLowerCase();
    languageSelect.value = browserLang.startsWith('zh') ? 'zh' : 'en';
  } else {
    // 使用已保存的语言设置
    languageSelect.value = language;
  }
  document.documentElement.lang = languageSelect.value;
  
  // Set token if exists
  if (token) {
    tokenInput.value = token;
  }

  // Initial text content update
  updateTextContent();

  // 监听语言选择变化
  languageSelect.addEventListener('change', (event) => {
    console.log('Language selection changed:', {
      from: document.documentElement.lang,
      to: event.target.value
    });
  });

  // Generate token
  generateTokenBtn.addEventListener('click', () => {
    tokenInput.value = Utils.generateUUID();
  });

  // Save settings
  saveBtn.addEventListener('click', async () => {
    const newLanguage = languageSelect.value;
    const newToken = tokenInput.value.trim();
    const currentLanguage = await getCurrentLanguage();

    console.log('Saving settings:', { newLanguage, currentLanguage });

    if (!newToken) {
      Utils.showToast(chrome.i18n.getMessage('errorNoToken'), 'error');
      return;
    }

    try {
      // 先保存 token
      await chrome.storage.local.set({ token: newToken });
      
      // 如果语言改变了，单独保存语言设置
      if (currentLanguage !== newLanguage) {
        console.log('Language changed, saving new language:', newLanguage);
        
        // 显示保存成功消息
        Utils.showToast(chrome.i18n.getMessage('settingsSaved'), 'success');
        
        // 等待消息显示
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 保存新语言设置
        await chrome.storage.local.set({ language: newLanguage });
        
        // 重新加载整个扩展
        chrome.runtime.reload();
      } else {
        Utils.showToast(chrome.i18n.getMessage('settingsSaved'), 'success');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      Utils.showToast(error.message, 'error');
    }
  });

  // View profile button click handler
  viewProfileBtn.addEventListener('click', () => {
    window.open('https://prompt.playwithai.fun/prompts', '_blank');
  });
}); 