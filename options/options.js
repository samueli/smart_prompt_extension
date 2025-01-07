import { i18n } from '../js/i18n.js';
import { Utils } from '../js/utils.js';
import { API } from '../js/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 初始化 i18n
  await i18n.init();
  
  // Get elements
  const languageSelect = document.getElementById('language');
  const tokenInput = document.getElementById('token');
  const generateTokenBtn = document.getElementById('generateTokenBtn');
  const saveBtn = document.getElementById('saveBtn');
  const viewProfileBtn = document.getElementById('viewProfileBtn');

  console.log('Options page loaded');

  // 获取当前语言
  const getCurrentLanguage = async () => {
    return i18n.getCurrentLanguage();
  };

  // Function to update all text content
  const updateTextContent = () => {
    console.log('Updating text content with language:', i18n.getCurrentLanguage());
    document.getElementById('extensionTitle').textContent = i18n.getMessage('extensionName');
    document.getElementById('extensionDesc').textContent = i18n.getMessage('extensionDescription');
    document.querySelector('#languageLabel span:last-child').textContent = i18n.getMessage('languageLabel');
    document.querySelector('#tokenLabel span:last-child').textContent = i18n.getMessage('tokenLabel');
    document.querySelector('#saveBtn span:last-child').textContent = i18n.getMessage('saveSettings');
    document.querySelector('#viewProfileBtn span:last-child').textContent = i18n.getMessage('viewProfile');
  };

  // Load saved settings
  const { token } = await chrome.storage.local.get('token');
  console.log('Loaded settings:', { language: i18n.getCurrentLanguage(), token });
  
  // 设置语言选择器的值
  languageSelect.value = i18n.getCurrentLanguage();
  
  // Set token if exists
  if (token) {
    tokenInput.value = token;
  }

  // Initial text content update
  updateTextContent();

  // 保存设置
  saveBtn.addEventListener('click', async () => {
    try {
      const newToken = tokenInput.value.trim();
      const newLanguage = languageSelect.value;
      const currentLanguage = i18n.getCurrentLanguage();
      
      // 保存设置
      await chrome.storage.local.set({
        token: newToken,
        language: newLanguage
      });

      // 只有在语言发生变化时才更新语言
      if (currentLanguage !== newLanguage) {
        await i18n.setLanguage(newLanguage);
        updateTextContent();
      }

      Utils.showToast(i18n.getMessage('settingsSaved'), 'success');
    } catch (error) {
      console.error('Save settings error:', error);
      Utils.showToast(error.message, 'error');
    }
  });

  // 生成新的 token
  generateTokenBtn.addEventListener('click', () => {
    tokenInput.value = Utils.generateUUID();
  });

  // 查看个人资料
  viewProfileBtn.addEventListener('click', () => {
    window.open('https://prompt.playwithai.fun/prompts', '_blank');
  });
}); 