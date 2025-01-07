import { i18n } from './i18n.js';

export class Utils {
  static showToast(message, type = 'info', duration = 3000) {
    // 移除现有的 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // 创建新的 toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // 如果是保存成功的消息，添加链接
    if (message === i18n.getMessage('promptSaved')) {
      const text = document.createElement('span');
      text.textContent = i18n.getMessage('promptSaved');
      
      const link = document.createElement('a');
      link.href = 'https://prompt.playwithai.fun/prompts';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = i18n.getMessage('viewSavedPrompts');
      link.style.marginLeft = '5px';
      link.style.color = 'inherit';
      link.style.textDecoration = 'underline';
      
      toast.appendChild(text);
      toast.appendChild(link);
    } else {
      toast.textContent = message;
    }
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 添加显示类名
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // 自动移除
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}