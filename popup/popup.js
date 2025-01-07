import { i18n } from '../js/i18n.js';
import { Utils } from '../js/utils.js';
import { API } from '../js/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 初始化 i18n
  await i18n.init();
  
  // 获取所有需要的 DOM 元素
  const promptInput = document.getElementById('promptInput');
  const businessScenario = document.getElementById('businessScenario');
  const optimizationFramework = document.getElementById('optimizationFramework');
  const outputFormat = document.getElementById('outputFormat');
  const optimizeBtn = document.getElementById('optimizeBtn');
  const saveBtn = document.getElementById('saveBtn');
  const optimizedInput = document.getElementById('optimizedInput');
  const optimizedGroup = document.querySelector('.optimized-group');
  const frameworkDescEl = document.querySelector('.framework-desc');
  const settingsBtn = document.getElementById('settingsBtn');

  // 设置按钮点击事件
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // 确保优化结果区域初始隐藏
  if (optimizedGroup) {
    optimizedGroup.classList.remove('show');
  }

  console.log('DOM Elements:', {
    promptInput,
    businessScenario,
    optimizationFramework,
    outputFormat,
    optimizeBtn,
    saveBtn,
    optimizedInput,
    optimizedGroup,
    frameworkDescEl
  });

  // 封装所有文本更新逻辑
  const updateAllText = () => {
    console.log('Updating all text content with language:', i18n.getCurrentLanguage());
    
    // 更新静态文本
    document.getElementById('extensionTitle').textContent = i18n.getMessage('extensionName');
    document.getElementById('extensionDesc').textContent = i18n.getMessage('extensionDescription');
    document.getElementById('sourcePromptLabel').textContent = i18n.getMessage('sourcePromptLabel');
    document.getElementById('optimizedPromptLabel').textContent = i18n.getMessage('optimizedPromptLabel');
    document.getElementById('businessScenarioLabel').textContent = i18n.getMessage('businessScenarioLabel');
    document.getElementById('frameworkLabel').textContent = i18n.getMessage('frameworkLabel');
    document.getElementById('formatLabel').textContent = i18n.getMessage('formatLabel');
    
    // 更新按钮文本
    optimizeBtn.querySelector('.button-text').textContent = i18n.getMessage('optimizeButton');
    saveBtn.querySelector('.button-text').textContent = i18n.getMessage('saveButton');
    promptInput.placeholder = i18n.getMessage('promptPlaceholder');
    
    // 更新选项文本
    setSelectOptions(businessScenario, [
      { value: 'general', msgKey: 'scenarioGeneral' },
      { value: 'coding', msgKey: 'scenarioCoding' },
      { value: 'writing', msgKey: 'scenarioWriting' },
      { value: 'official', msgKey: 'scenarioOfficial' },
      { value: 'translation', msgKey: 'scenarioTranslation' },
      { value: 'analysis', msgKey: 'scenarioAnalysis' },
      { value: 'roleplay', msgKey: 'scenarioRoleplay' },
      { value: 'marketing', msgKey: 'scenarioMarketing' },
      { value: 'email', msgKey: 'scenarioEmail' },
      { value: 'academic', msgKey: 'scenarioAcademic' },
      { value: 'storytelling', msgKey: 'scenarioStorytelling' },
      { value: 'interview', msgKey: 'scenarioInterview' },
      { value: 'teaching', msgKey: 'scenarioTeaching' },
      { value: 'presentation', msgKey: 'scenarioPresentation' }
    ]);
    
    setSelectOptions(outputFormat, [
      { value: 'text', msgKey: 'formatText' },
      { value: 'xml', msgKey: 'formatXml' },
      { value: 'json', msgKey: 'formatJson' },
      { value: 'markdown', msgKey: 'formatMarkdown' }
    ]);
  };

  // Set select options text
  const setSelectOptions = (selectElem, options) => {
    const currentValue = selectElem.value;
    selectElem.innerHTML = '';
    options.forEach(({ value, msgKey }) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = i18n.getMessage(msgKey);
      selectElem.appendChild(option);
    });
    selectElem.value = currentValue;
  };

  // 加载框架列表
  const loadFrameworks = async () => {
    try {
      const frameworks = await API.getFrameworks();
      const currentValue = optimizationFramework.value;
      optimizationFramework.innerHTML = '';
      
      // 根据当前语言选择对应的名称和描述
      const isEnglish = i18n.getCurrentLanguage() === 'en';
      const nameKey = isEnglish ? 'en_name' : 'cn_name';
      const descKey = isEnglish ? 'en_description' : 'cn_description';
      
      // 确保有默认选项
      const defaultOption = document.createElement('option');
      defaultOption.value = 'GENERAL';
      defaultOption.textContent = isEnglish ? 'General Optimization' : '通用优化';
      defaultOption.dataset.description = isEnglish 
        ? 'This is a professional prompt optimization assistant framework...' 
        : '这是一个专业的prompt优化助手框架...';
      defaultOption.title = defaultOption.dataset.description;
      optimizationFramework.appendChild(defaultOption);
      
      frameworks.forEach(framework => {
        if (framework.code === 'GENERAL') return; // 跳过通用优化，因为已经添加为默认选项
        const option = document.createElement('option');
        option.value = framework.code;
        option.textContent = framework[nameKey];
        option.dataset.description = framework[descKey];
        option.title = framework[descKey];
        optimizationFramework.appendChild(option);
      });
      
      // 如果有之前选择的值且该值在新的选项中存在，则使用之前的值
      // 否则使用默认值 'GENERAL'
      const hasValue = Array.from(optimizationFramework.options)
        .some(option => option.value === currentValue);
      optimizationFramework.value = hasValue ? currentValue : 'GENERAL';
      
      // 更新框架描述
      const selectedOption = optimizationFramework.options[optimizationFramework.selectedIndex];
      if (selectedOption) {
        frameworkDescEl.textContent = selectedOption.dataset.description;
      }
    } catch (error) {
      console.error('Load frameworks error:', error);
      Utils.showToast(error.message, 'error');
      
      // 发生错误时也要确保有默认选项
      const isEnglish = i18n.getCurrentLanguage() === 'en';
      optimizationFramework.innerHTML = '';
      const defaultOption = document.createElement('option');
      defaultOption.value = 'GENERAL';
      defaultOption.textContent = isEnglish ? 'General Optimization' : '通用优化';
      defaultOption.dataset.description = isEnglish 
        ? 'This is a professional prompt optimization assistant framework...' 
        : '这是一个专业的prompt优化助手框架...';
      defaultOption.title = defaultOption.dataset.description;
      optimizationFramework.appendChild(defaultOption);
      optimizationFramework.value = 'GENERAL';
      
      if (frameworkDescEl) {
        frameworkDescEl.textContent = defaultOption.dataset.description;
      }
    }
  };

  // 监听存储变化，更新界面语言
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.language) {
      console.log('Language changed in storage:', changes.language);
      i18n.setLanguage(changes.language.newValue);
      updateAllText();
      loadFrameworks(); // 重新加载框架列表以更新语言
    }
  });

  // 初始化界面
  updateAllText();
  loadFrameworks();

  // Update button states based on input
  const updateButtonStates = () => {
    const hasPrompt = promptInput.value.trim().length > 0;
    const hasOptimized = optimizedInput.value.trim().length > 0;
    
    optimizeBtn.disabled = !hasPrompt;
    saveBtn.disabled = !hasOptimized;
  };

  // Listen for input changes
  promptInput.addEventListener('input', updateButtonStates);
  optimizedInput.addEventListener('input', updateButtonStates);

  // Add loading state class
  const setLoading = (button, isLoading) => {
    const loadingClass = 'loading';
    if (isLoading) {
      button.classList.add(loadingClass);
      button.disabled = true;
    } else {
      button.classList.remove(loadingClass);
      button.disabled = false;
    }
  };

  // 优化按钮点击事件
  optimizeBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    try {
      setLoading(optimizeBtn, true);
      
      // 获取当前选中的框架的description
      const selectedOption = optimizationFramework.options[optimizationFramework.selectedIndex];
      const frameworkDescription = selectedOption.getAttribute('data-description');
      
      console.log('Selected framework description:', frameworkDescription);
      
      const result = await API.optimizePrompt(prompt, {
        businessScenario: businessScenario.value,
        frameworkDescription: frameworkDescription,
        outputFormat: outputFormat.value
      });
      
      console.log('Optimization result:', result);
      
      // 确保优化结果显示区域可见并设置文本
      if (optimizedGroup) {
        optimizedGroup.classList.add('show');
        console.log('Showing optimized group');
        
        // 等待动画完成后滚动到底部
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }, 300);
      } else {
        console.error('optimizedGroup not found');
      }
      
      if (optimizedInput) {
        optimizedInput.value = result || '';
        console.log('Setting optimized input value:', result);
      } else {
        console.error('optimizedInput not found');
      }
      
      // 更新按钮状态
      updateButtonStates();
      
      // 如果优化成功，显示成功提示
      if (result) {
        Utils.showToast(i18n.getMessage('optimizedSuccess'), 'success');
      }
      
    } catch (error) {
      console.error('Optimize error:', error);
      Utils.showToast(error.message, 'error');
      // 发生错误时隐藏优化结果区域
      if (optimizedGroup) {
        optimizedGroup.classList.remove('show');
      }
    } finally {
      setLoading(optimizeBtn, false);
    }
  });

  // 保存按钮点击事件
  saveBtn.addEventListener('click', async () => {
    const sourcePrompt = promptInput.value.trim();
    const optimizedPrompt = optimizedInput.value.trim();
    if (!sourcePrompt || !optimizedPrompt) return;

    try {
      setLoading(saveBtn, true);
      await API.savePrompt(sourcePrompt, optimizedPrompt);
      
      Utils.showToast(i18n.getMessage('promptSaved'), 'success');
    } catch (error) {
      console.error('Save error:', error);
      Utils.showToast(error.message, 'error');
    } finally {
      setLoading(saveBtn, false);
    }
  });

  // 更新框架描述的事件监听器
  optimizationFramework.addEventListener('change', (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    frameworkDescEl.textContent = selectedOption.dataset.description;
  });

  // 创建 tooltip 元素
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  document.body.appendChild(tooltip);
  
  let tooltipTimeout;
  
  // 添加 tooltip 显示/隐藏功能
  const showTooltip = (text, x, y) => {
    if (!text) return;
    
    // 清除之前的定时器
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
    
    tooltip.textContent = text;
    tooltip.classList.add('show');
    
    // 计算位置，只需要考虑垂直方向
    const rect = tooltip.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // 默认显示在选择框上方
    let top = y - rect.height - 1;
    
    // 如果会超出上边界，显示在选择框下方
    if (top < 0) {
      top = y + 24;
    }
    
    tooltip.style.top = top + 'px';
  };
  
  const hideTooltip = (immediate = false) => {
    if (immediate) {
      tooltip.classList.remove('show');
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
      }
    } else {
      // 添加 200ms 延迟，避免鼠标移动时闪烁
      tooltipTimeout = setTimeout(() => {
        tooltip.classList.remove('show');
      }, 200);
    }
  };
  
  // 为 optimizationFramework 添加 tooltip 事件
  optimizationFramework.addEventListener('mouseover', (event) => {
    if (event.target.tagName === 'OPTION') {
      const rect = optimizationFramework.getBoundingClientRect();
      showTooltip(event.target.dataset.description, rect.left + rect.width / 2, rect.top);
    }
  });
  
  optimizationFramework.addEventListener('mouseout', (event) => {
    // 检查是否真的移出了 select 元素
    const relatedTarget = event.relatedTarget;
    if (!optimizationFramework.contains(relatedTarget)) {
      hideTooltip();
    }
  });
  
  optimizationFramework.addEventListener('change', () => {
    hideTooltip(true);
  });
  
  // 在页面滚动时隐藏 tooltip
  window.addEventListener('scroll', () => {
    hideTooltip(true);
  });
});