import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, FloatButton } from 'antd';
import { QuestionCircleOutlined, BgColorsOutlined } from '@ant-design/icons';
import Sidebar from './components/Sidebar';
import ProjectManager from './pages/ProjectManager';
import DebugConsole from './pages/DebugConsole';
import BuildConfig from './pages/BuildConfig';
import BuildProcess from './pages/BuildProcess';
import PluginManager from './pages/PluginManager';
import HelpSystem from './components/HelpSystem';
import ThemeSettings from './components/ThemeSettings';
import { useThemeStore } from './store/useThemeStore';

const { Content } = Layout;

function App() {
  const [helpVisible, setHelpVisible] = useState(false);
  const [themeVisible, setThemeVisible] = useState(false);
  const { config, actualMode } = useThemeStore();

  // 监听F1键打开帮助
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F1') {
        event.preventDefault();
        setHelpVisible(true);
      }
      if (event.key === 'Escape') {
        setHelpVisible(false);
        setThemeVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sidebar />
      <Layout>
        <Content style={{
          padding: config.compactMode ? '16px' : '24px',
          overflow: 'auto',
          backgroundColor: actualMode === 'dark' ? '#000000' : '#f0f2f5'
        }}>
          <Routes>
            <Route path="/" element={<ProjectManager />} />
            <Route path="/projects" element={<ProjectManager />} />
            <Route path="/debug" element={<DebugConsole />} />
            <Route path="/build-config" element={<BuildConfig />} />
            <Route path="/build" element={<BuildProcess />} />
            <Route path="/plugins" element={<PluginManager />} />
          </Routes>
        </Content>
      </Layout>

      {/* 浮动按钮 */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<QuestionCircleOutlined />}
      >
        <FloatButton
          icon={<QuestionCircleOutlined />}
          tooltip="帮助中心 (F1)"
          onClick={() => setHelpVisible(true)}
        />
        <FloatButton
          icon={<BgColorsOutlined />}
          tooltip="主题设置"
          onClick={() => setThemeVisible(true)}
        />
      </FloatButton.Group>

      {/* 帮助系统 */}
      <HelpSystem
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />

      {/* 主题设置 */}
      <ThemeSettings
        visible={themeVisible}
        onClose={() => setThemeVisible(false)}
      />
    </Layout>
  );
}

export default App;
