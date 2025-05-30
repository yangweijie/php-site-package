import React from 'react';
import { Tag, Tooltip } from 'antd';
import { CloudOutlined, DesktopOutlined } from '@ant-design/icons';
import { getEnvironmentInfo } from '../utils/environment';

/**
 * 环境指示器组件
 * 显示当前运行环境（Tauri 桌面应用 或 浏览器）
 */
const EnvironmentIndicator: React.FC = () => {
  const envInfo = getEnvironmentInfo();

  const getIcon = () => {
    return envInfo.isTauri ? <DesktopOutlined /> : <CloudOutlined />;
  };

  const getColor = () => {
    return envInfo.isTauri ? 'green' : 'blue';
  };

  const getTooltipContent = () => {
    return (
      <div>
        <div><strong>运行环境:</strong> {envInfo.isTauri ? 'Tauri 桌面应用' : '浏览器演示模式'}</div>
        <div><strong>平台:</strong> {envInfo.platform}</div>
        {envInfo.isBrowser && (
          <div style={{ marginTop: 8, color: '#faad14' }}>
            <strong>注意:</strong> 浏览器模式下部分功能使用模拟数据
          </div>
        )}
      </div>
    );
  };

  return (
    <Tooltip title={getTooltipContent()}>
      <Tag 
        icon={getIcon()} 
        color={getColor()}
        style={{ cursor: 'help' }}
      >
        {envInfo.isTauri ? '桌面应用' : '浏览器模式'}
      </Tag>
    </Tooltip>
  );
};

export default EnvironmentIndicator;
