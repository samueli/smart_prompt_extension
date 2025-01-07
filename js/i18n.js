// 语言包
const messages = {
  en: {
    extensionName: "Smart Prompt",
    extensionDescription: "Save and optimize your prompts",
    saveButton: "Save",
    optimizeButton: "Optimize",
    settingsTitle: "Settings",
    languageLabel: "Language",
    tokenLabel: "API Token",
    saveSettings: "Save Settings",
    viewProfile: "View Profile",
    errorNoToken: "Please enter API token",
    errorTokenRequired: "Please set the API token in Settings first",
    settingsSaved: "Settings saved successfully",
    sourcePromptLabel: "Source Prompt",
    optimizedPromptLabel: "Optimized Prompt",
    businessScenarioLabel: "Business Scenario",
    frameworkLabel: "Optimization Framework",
    formatLabel: "Output Format",
    promptPlaceholder: "Enter your prompt here...",
    promptSaved: "Prompt saved successfully. ",
    viewSavedPrompts: "Click here to view all saved prompts",
    optimizingPrompt: "Optimizing prompt...",
    optimizedSuccess: "Prompt optimized successfully",
    savingPrompt: "Saving prompt...",
    savedSuccess: "Prompt saved successfully",

    // 场景选项
    scenarioGeneral: "General Conversation",
    scenarioCoding: "Code Programming",
    scenarioWriting: "Article Writing",
    scenarioOfficial: "Official Writing",
    scenarioTranslation: "Language Translation",
    scenarioAnalysis: "Data Analysis",
    scenarioRoleplay: "Role Playing",
    scenarioMarketing: "Marketing Copy",
    scenarioEmail: "Email Writing",
    scenarioAcademic: "Academic Writing",
    scenarioStorytelling: "Story Creation",
    scenarioInterview: "Interview Dialog",
    scenarioTeaching: "Teaching",
    scenarioPresentation: "Presentation Writing",

    // 格式选项
    formatText: "Plain Text",
    formatXml: "XML",
    formatJson: "JSON",
    formatMarkdown: "Markdown"
  },
  zh: {
    extensionName: "Smart Prompt",
    extensionDescription: "一键优化和管理你的AI提示词",
    saveButton: "一键保存",
    optimizeButton: "智能优化",
    settingsTitle: "设置",
    languageLabel: "语言",
    tokenLabel: "API Token",
    saveSettings: "保存设置",
    viewProfile: "查看主页",
    errorNoToken: "请输入 API Token",
    errorTokenRequired: "请先在设置中设置API令牌",
    settingsSaved: "设置保存成功",
    sourcePromptLabel: "原始提示词",
    optimizedPromptLabel: "优化后的提示词",
    businessScenarioLabel: "业务场景",
    frameworkLabel: "优化框架",
    formatLabel: "输出格式",
    promptPlaceholder: "在此输入你的提示词...",
    promptSaved: "提示词保存成功。",
    viewSavedPrompts: "点击此处查看所有保存的提示词",
    optimizingPrompt: "正在优化提示词...",
    optimizedSuccess: "提示词优化成功",
    savingPrompt: "正在保存提示词...",
    savedSuccess: "提示词保存成功",

    // 场景选项
    scenarioGeneral: "通用对话",
    scenarioCoding: "代码编程",
    scenarioWriting: "文章写作",
    scenarioOfficial: "公文写作",
    scenarioTranslation: "语言翻译",
    scenarioAnalysis: "数据分析",
    scenarioRoleplay: "角色扮演",
    scenarioMarketing: "营销文案",
    scenarioEmail: "邮件写作",
    scenarioAcademic: "学术写作",
    scenarioStorytelling: "故事创作",
    scenarioInterview: "面试对话",
    scenarioTeaching: "教学辅导",
    scenarioPresentation: "演讲稿写作",

    // 格式选项
    formatText: "纯文本",
    formatXml: "XML",
    formatJson: "JSON",
    formatMarkdown: "Markdown"
  }
};

class I18n {
  constructor() {
    this.currentLanguage = 'en';
  }

  async init() {
    const { language = 'en' } = await chrome.storage.local.get('language');
    this.currentLanguage = language;
    return this;
  }

  getMessage(key) {
    return messages[this.currentLanguage]?.[key] || messages.en[key] || key;
  }

  async setLanguage(lang) {
    if (messages[lang]) {
      this.currentLanguage = lang;
      await chrome.storage.local.set({ language: lang });
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

// 导出单例实例
export const i18n = new I18n();
