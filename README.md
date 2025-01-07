# Smart Prompt 浏览器扩展

Smart Prompt 是一个强大的浏览器扩展，帮助用户高效管理和优化提示词（Prompts）。无论您是AI开发者、内容创作者，还是日常使用AI工具的用户，这个扩展都能让您的工作流程更加顺畅。

## ✨ 主要特性

- 🔄 提示词保存与管理
- 🎯 智能提示词优化，支持多种优化框架
- 🌍 多语言支持（中文、英文）
- 🎨 场景化的优化选项（通用对话、代码编程、文章写作等）
- 📝 多种输出格式支持（纯文本、XML、JSON、Markdown）
- ⚙️ 可配置的API设置
- 💾 本地数据存储
- 🔒 安全的数据处理
- 📱 响应式设计，完美适配各种屏幕尺寸
- 🌟 优雅的用户界面和交互体验

## 🛠️ 技术栈

- Chrome Extension Manifest V3
- Chrome Storage API
- Chrome i18n 国际化支持
- JavaScript ES6+
- 现代化 CSS3 特性
- RESTful API 集成

## 📦 安装方法

### 开发者安装
1. 克隆仓库到本地：
```bash
git clone [repository-url]
cd smart_prompt_extension
```

2. 安装依赖：
```bash
npm install --verbose
```

3. 构建项目：
```bash
npm run build
```

4. 在Chrome浏览器中加载扩展：
   - 打开 Chrome 浏览器，访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目目录

### 用户安装
- 从 Chrome 网上应用店安装（即将上线）

## 🚀 使用指南

### 基本使用
1. 点击浏览器工具栏中的扩展图标
2. 在弹出窗口中可以：
   - 输入并优化提示词
   - 选择业务场景和优化框架
   - 设置输出格式
   - 保存优化后的提示词
   - 查看所有保存的提示词

### 优化框架
扩展支持多种优化框架：
- BROKE框架：将普通提示词转换为结构化格式
- APE框架：专注于提示词的准确性和效率
- LangGPT：优化提示词的语言表达
- PromptWizard：智能调整提示词结构

### 设置选项
1. 点击扩展界面右上角的设置图标
2. 在设置页面可以：
   - 切换界面语言（中文/英文）
   - 配置 API Token
   - 查看使用说明

## 📂 项目结构

```
smart_prompt_extension/
├── _locales/          # 多语言支持文件
│   ├── en/           # 英文语言包
│   └── zh/           # 中文语言包
├── assets/           # 静态资源文件
├── js/              # JavaScript 源代码
│   ├── api.js       # API 接口封装
│   ├── i18n.js      # 国际化工具
│   └── utils.js     # 通用工具函数
├── popup/           # 扩展弹出窗口相关文件
├── options/         # 设置页面相关文件
├── background.js    # 后台服务脚本
└── manifest.json    # 扩展配置文件
```

## 🔧 开发指南

### 本地开发
1. 修改代码后刷新扩展：
   - 在 Chrome 扩展页面点击刷新按钮
   - 或重新加载扩展

### 多语言开发
- 在 `_locales` 目录下相应的语言文件中添加新的文本键值对
- 使用 `i18n.getMessage()` 方法获取翻译文本

### API 开发
- API 请求都封装在 `api.js` 中
- 使用 Bearer Token 认证
- 支持错误处理和状态提示

## 📝 注意事项

- 请确保在使用前配置正确的API Token
- 所有数据均存储在本地，注意定期备份重要的提示词
- 扩展会自动检测浏览器语言并设置对应的界面语言
- 使用最小权限原则，确保安全性
- 优化后的提示词可以在线查看和管理

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
