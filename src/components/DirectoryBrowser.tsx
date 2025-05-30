import React, { useState, useEffect } from 'react';
import {
  Modal,
  Tree,
  Input,
  Button,
  Space,
  Typography,
  Breadcrumb,
  Empty,
  Spin,
  Alert
} from 'antd';
import {
  FolderOutlined,
  FolderOpenOutlined,
  SearchOutlined,
  HomeOutlined,
  CodeOutlined,
  FileOutlined
} from '@ant-design/icons';
import { mockFileSystem, DirectoryNode, getProjectTypeColor } from '../data/mockFileSystem';

const { Search } = Input;
const { Text } = Typography;

interface DirectoryBrowserProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (path: string) => void;
}

const DirectoryBrowser: React.FC<DirectoryBrowserProps> = ({
  visible,
  onCancel,
  onSelect
}) => {
  const [treeData, setTreeData] = useState<DirectoryNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');



  useEffect(() => {
    if (visible) {
      setLoading(true);
      // 模拟加载延迟
      setTimeout(() => {
        setTreeData(mockFileSystem);
        setExpandedKeys(['/home', '/home/developer', '/home/developer/projects']);
        setLoading(false);
      }, 500);
    }
  }, [visible]);

  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    const key = selectedKeys[0] as string;
    setSelectedKeys([key]);
    setCurrentPath(key);
  };

  const handleExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys as string[]);
  };

  const handleConfirm = () => {
    if (selectedKeys.length > 0) {
      onSelect(selectedKeys[0]);
    }
  };

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'home': return <HomeOutlined />;
      case 'folder': return <FolderOutlined />;
      case 'code': return <CodeOutlined />;
      case 'file': return <FileOutlined />;
      default: return <FolderOutlined />;
    }
  };

  const renderTreeNode = (node: DirectoryNode) => {
    const isProject = node.isProject;
    const title = (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {getIcon(node.iconType)}
        <span>{node.title}</span>
        {isProject && (
          <span style={{
            fontSize: '12px',
            color: '#fff',
            backgroundColor: getProjectTypeColor(node.projectType || 'PHP'),
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            {node.projectType}
          </span>
        )}
      </span>
    );

    return {
      ...node,
      title,
      icon: undefined // 已经在 title 中渲染了图标
    };
  };

  const processTreeData = (data: DirectoryNode[]): any[] => {
    return data.map(node => {
      const processed = renderTreeNode(node);
      if (node.children) {
        processed.children = processTreeData(node.children);
      }
      return processed;
    });
  };

  const filteredTreeData = processTreeData(treeData);

  const getBreadcrumbItems = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    const items = [
      {
        title: <HomeOutlined />
      }
    ];

    let currentPathBuild = '';
    pathParts.forEach(part => {
      currentPathBuild += '/' + part;
      items.push({
        title: part
      });
    });

    return items;
  };

  const selectedNode = treeData.find(node => findNodeByKey(node, selectedKeys[0]));
  const isProjectSelected = selectedNode?.isProject;

  return (
    <Modal
      title="选择项目目录"
      open={visible}
      onCancel={onCancel}
      width={800}
      height={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          disabled={selectedKeys.length === 0}
        >
          选择此目录
        </Button>
      ]}
    >
      <div style={{ height: 500 }}>
        <Alert
          message="浏览器演示模式"
          description="这是一个模拟的文件系统浏览器。在实际的桌面应用中，您可以浏览真实的文件系统。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Space direction="vertical" style={{ width: '100%' }}>
          <Search
            placeholder="搜索目录..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ marginBottom: 8 }}
          />

          <Breadcrumb items={getBreadcrumbItems()} style={{ marginBottom: 8 }} />

          {selectedKeys.length > 0 && (
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: '6px',
              marginBottom: 8
            }}>
              <Text strong>已选择: </Text>
              <Text code>{selectedKeys[0]}</Text>
              {isProjectSelected && (
                <Text type="success" style={{ marginLeft: 8 }}>
                  ✓ 检测到 PHP 项目
                </Text>
              )}
            </div>
          )}

          <div style={{
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            padding: '8px',
            height: 350,
            overflow: 'auto'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>加载目录结构...</div>
              </div>
            ) : filteredTreeData.length > 0 ? (
              <Tree
                treeData={filteredTreeData}
                expandedKeys={expandedKeys}
                selectedKeys={selectedKeys}
                onSelect={handleSelect}
                onExpand={handleExpand}
                showIcon={false}
                style={{ fontSize: '14px' }}
              />
            ) : (
              <Empty description="没有找到目录" />
            )}
          </div>
        </Space>
      </div>
    </Modal>
  );
};

// 辅助函数：在树中查找节点
const findNodeByKey = (node: DirectoryNode, key: string): DirectoryNode | null => {
  if (node.key === key) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByKey(child, key);
      if (found) return found;
    }
  }
  return null;
};

export default DirectoryBrowser;
