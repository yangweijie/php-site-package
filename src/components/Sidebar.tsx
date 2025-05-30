import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FolderOutlined,
  BugOutlined,
  SettingOutlined,
  BuildOutlined,
  AppstoreOutlined,
  ApiOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/projects',
      icon: <FolderOutlined />,
      label: '项目管理',
    },
    {
      key: '/debug',
      icon: <BugOutlined />,
      label: '调试控制台',
    },
    {
      key: '/build-config',
      icon: <SettingOutlined />,
      label: '打包配置',
    },
    {
      key: '/build',
      icon: <BuildOutlined />,
      label: '构建分发',
    },
    {
      key: '/plugins',
      icon: <ApiOutlined />,
      label: '插件管理',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider width={200} theme="dark">
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        <AppstoreOutlined style={{ marginRight: 8 }} />
        PHP Packager
      </div>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ height: 'calc(100% - 64px)', borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
