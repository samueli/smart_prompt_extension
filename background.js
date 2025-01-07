// 监听安装事件
chrome.runtime.onInstalled.addListener(async () => {
  // 设置默认语言
  const { language } = await chrome.storage.local.get('language');
  console.log('Extension installed, current language:', language);
  if (!language) {
    // 获取浏览器语言
    const browserLang = chrome.i18n.getUILanguage().toLowerCase();
    // 如果是中文，设置为 zh，否则设置为 en
    const defaultLang = browserLang.startsWith('zh') ? 'zh' : 'en';
    console.log('Setting default language to:', defaultLang);
    await chrome.storage.local.set({ language: defaultLang });
  }
});

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.language) {
    console.log('Language changed:', {
      oldValue: changes.language.oldValue,
      newValue: changes.language.newValue
    });
    
    // 通知所有打开的扩展页面重新加载
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && tab.url.startsWith('chrome-extension://')) {
          chrome.tabs.reload(tab.id);
        }
      });
    });
  }
}); 