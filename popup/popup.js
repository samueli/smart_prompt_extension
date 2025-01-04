document.addEventListener('DOMContentLoaded', async () => {
  // 获取当前语言设置
  const { language = 'en' } = await chrome.storage.local.get('language');
  document.documentElement.lang = language;

  // 封装所有文本更新逻辑
  const updateAllText = () => {
    console.log('Updating all text content with language:', document.documentElement.lang);
    
    // 更新静态文本
    document.getElementById('extensionTitle').textContent = chrome.i18n.getMessage('extensionName');
    document.getElementById('extensionDesc').textContent = chrome.i18n.getMessage('extensionDescription');
    document.getElementById('sourcePromptLabel').textContent = chrome.i18n.getMessage('sourcePromptLabel');
    document.getElementById('optimizedPromptLabel').textContent = chrome.i18n.getMessage('optimizedPromptLabel');
    document.getElementById('businessScenarioLabel').textContent = chrome.i18n.getMessage('businessScenarioLabel');
    document.getElementById('frameworkLabel').textContent = chrome.i18n.getMessage('frameworkLabel');
    document.getElementById('formatLabel').textContent = chrome.i18n.getMessage('formatLabel');
    
    // 更新按钮文本
    optimizeBtn.querySelector('.button-text').textContent = chrome.i18n.getMessage('optimizeButton');
    saveBtn.querySelector('.button-text').textContent = chrome.i18n.getMessage('saveButton');
    promptInput.placeholder = chrome.i18n.getMessage('promptPlaceholder');
    
    // 更新选项文本
    setSelectOptions(businessScenario, [
      { index: 0, msgKey: 'scenarioGeneral' },
      { index: 1, msgKey: 'scenarioCoding' },
      { index: 2, msgKey: 'scenarioWriting' },
      { index: 3, msgKey: 'scenarioOfficial' },
      { index: 4, msgKey: 'scenarioTranslation' },
      { index: 5, msgKey: 'scenarioAnalysis' },
      { index: 6, msgKey: 'scenarioRoleplay' },
      { index: 7, msgKey: 'scenarioMarketing' },
      { index: 8, msgKey: 'scenarioEmail' },
      { index: 9, msgKey: 'scenarioAcademic' },
      { index: 10, msgKey: 'scenarioStorytelling' },
      { index: 11, msgKey: 'scenarioInterview' },
      { index: 12, msgKey: 'scenarioTeaching' },
      { index: 13, msgKey: 'scenarioPresentation' }
    ]);
    
    setSelectOptions(outputFormat, [
      { index: 0, msgKey: 'formatText' },
      { index: 1, msgKey: 'formatXml' },
      { index: 2, msgKey: 'formatJson' },
      { index: 3, msgKey: 'formatMarkdown' }
    ]);
  };

  // Set select options text
  const setSelectOptions = (selectElement, options) => {
    console.log('Setting select options for:', selectElement.id);
    options.forEach(option => {
      const text = chrome.i18n.getMessage(option.msgKey);
      console.log(`- Option ${option.index}: ${option.msgKey} -> ${text}`);
      selectElement.options[option.index].text = text;
    });
  };

  // 加载框架列表
  const loadFrameworks = async () => {
    try {
      frameworksData = await API.getFrameworks();
      
      // 清空现有选项
      optimizationFramework.innerHTML = '';
      
      // 获取当前语言
      const { language = 'en' } = await chrome.storage.local.get('language');
      const nameKey = language === 'zh' ? 'cn_name' : 'en_name';
      const descKey = language === 'zh' ? 'cn_description' : 'en_description';
      
      console.log('Loading frameworks with language:', language);
      
      // 添加新选项
      frameworksData.forEach((framework, index) => {
        const option = document.createElement('option');
        option.value = framework.id;
        option.textContent = framework[nameKey];
        option.dataset.description = framework[descKey];
        optimizationFramework.appendChild(option);
      });
      
      // 设置初始描述
      if (frameworksData.length > 0) {
        frameworkDescEl.textContent = frameworksData[0][descKey];
      }
    } catch (error) {
      console.error('Failed to load frameworks:', error);
      Utils.showToast(error.message, 'error');
    }
  };

  const promptInput = document.getElementById('promptInput');
  const optimizedInput = document.getElementById('optimizedInput');
  const optimizedGroup = document.querySelector('.optimized-group');
  const optimizeBtn = document.getElementById('optimizeBtn');
  const saveBtn = document.getElementById('saveBtn');
  const businessScenario = document.getElementById('businessScenario');
  const optimizationFramework = document.getElementById('optimizationFramework');
  const outputFormat = document.getElementById('outputFormat');
  const frameworkDescEl = document.querySelector('.framework-desc');

  // 存储框架数据
  let frameworksData = [];

  // Set static text content
  document.getElementById('extensionTitle').textContent = chrome.i18n.getMessage('extensionName');
  document.getElementById('extensionDesc').textContent = chrome.i18n.getMessage('extensionDescription');
  document.getElementById('sourcePromptLabel').textContent = chrome.i18n.getMessage('sourcePromptLabel');
  document.getElementById('optimizedPromptLabel').textContent = chrome.i18n.getMessage('optimizedPromptLabel');
  document.getElementById('businessScenarioLabel').textContent = chrome.i18n.getMessage('businessScenarioLabel');
  document.getElementById('frameworkLabel').textContent = chrome.i18n.getMessage('frameworkLabel');
  document.getElementById('formatLabel').textContent = chrome.i18n.getMessage('formatLabel');

  // Set button text
  optimizeBtn.querySelector('.button-text').textContent = chrome.i18n.getMessage('optimizeButton');
  saveBtn.querySelector('.button-text').textContent = chrome.i18n.getMessage('saveButton');
  promptInput.placeholder = chrome.i18n.getMessage('promptPlaceholder');

  // 初始化
  updateAllText();
  loadFrameworks();

  // 更新框架描述的事件监听器
  optimizationFramework.addEventListener('change', (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    frameworkDescEl.textContent = selectedOption.dataset.description;
  });

  setSelectOptions(outputFormat, [
    { index: 0, msgKey: 'formatText' },
    { index: 1, msgKey: 'formatXml' },
    { index: 2, msgKey: 'formatJson' },
    { index: 3, msgKey: 'formatMarkdown' }
  ]);

  // Update button states based on input
  const updateButtonStates = () => {
    const hasText = promptInput.value.trim().length > 0;
    optimizeBtn.disabled = !hasText;
    saveBtn.disabled = !(hasText || optimizedInput.value.trim().length > 0);
  };

  // Listen for input changes
  promptInput.addEventListener('input', updateButtonStates);
  optimizedInput.addEventListener('input', updateButtonStates);

  // Add loading state class
  const setLoading = (button, isLoading) => {
    button.disabled = isLoading;
    if (isLoading) {
      button.classList.add('loading');
    } else {
      button.classList.remove('loading');
      updateButtonStates(); // Restore correct disabled state
    }
  };

  optimizeBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    setLoading(optimizeBtn, true);
    try {
      Utils.showToast(chrome.i18n.getMessage('optimizingPrompt'));
      const selectedOption = optimizationFramework.options[optimizationFramework.selectedIndex];
      const optimizedPrompt = await API.optimizePrompt(prompt, {
        businessScenario: businessScenario.value,
        frameworkDescription: selectedOption.dataset.description,
        outputFormat: outputFormat.value
      });
      
      // 先设置文本内容
      optimizedInput.value = optimizedPrompt;
      
      // 移除内联样式
      optimizedGroup.style.removeProperty('display');
      
      // 添加显示类
      optimizedGroup.classList.add('show');
      
      // 等待过渡动画完成后滚动
      setTimeout(() => {
        window.scrollTo({
          top: optimizedGroup.offsetTop - 20,
          behavior: 'smooth'
        });
      }, 300);
      
      Utils.showToast(chrome.i18n.getMessage('optimizedSuccess'), 'success');
    } catch (error) {
      Utils.showToast(error.message, 'error');
    } finally {
      setLoading(optimizeBtn, false);
    }
  });

  saveBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    const optimizedPrompt = optimizedInput.value.trim();
    if (!prompt && !optimizedPrompt) return;

    setLoading(saveBtn, true);
    try {
      Utils.showToast(chrome.i18n.getMessage('savingPrompt'));
      await API.savePrompt(prompt || optimizedPrompt, optimizedPrompt);
      Utils.showToast(chrome.i18n.getMessage('savedSuccess'), 'success');
    } catch (error) {
      Utils.showToast(error.message, 'error');
    } finally {
      setLoading(saveBtn, false);
    }
  });
}); 