import { App } from 'antd';

/**
 * 自定义 message hook，用于替代静态 message 方法
 * 解决 "Static function can not consume context like dynamic theme" 警告
 */
export const useMessage = () => {
  const { message } = App.useApp();
  return message;
};

export default useMessage;
