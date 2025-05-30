/**
 * 环境检测工具
 * 用于判断应用是否在 Tauri 桌面环境中运行
 */

/**
 * 检查是否在 Tauri 环境中运行
 */
export const isTauriEnvironment = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.__TAURI_IPC__ === 'function';
};

/**
 * 检查是否在浏览器环境中运行
 */
export const isBrowserEnvironment = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.__TAURI_IPC__ === 'undefined';
};

/**
 * 获取当前运行环境
 */
export const getCurrentEnvironment = (): 'tauri' | 'browser' | 'unknown' => {
  if (typeof window === 'undefined') {
    return 'unknown';
  }
  
  if (typeof window.__TAURI_IPC__ === 'function') {
    return 'tauri';
  }
  
  return 'browser';
};

/**
 * 环境信息
 */
export const getEnvironmentInfo = () => {
  const env = getCurrentEnvironment();
  
  return {
    environment: env,
    isTauri: env === 'tauri',
    isBrowser: env === 'browser',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown'
  };
};
