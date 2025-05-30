import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  List,
  Typography,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Empty,
  Popconfirm
} from 'antd';
import { useMessage } from '../hooks/useMessage';
import {
  PlusOutlined,
  FolderOpenOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import { tauriCommands, generateRandomPort, getProjectTypeColor } from '../utils/tauri';
import { isTauriEnvironment } from '../utils/environment';
import ProjectConfigModal from '../components/ProjectConfigModal';
import EnvironmentIndicator from '../components/EnvironmentIndicator';
import DirectoryBrowser from '../components/DirectoryBrowser';

const { Title, Text } = Typography;
const { Option } = Select;

interface PhpProject {
  id: string;
  name: string;
  path: string;
  project_type: string;
  entry_file: string;
  created_at: string;
  last_modified: string;
}

const ProjectManager: React.FC = () => {
  const { projects, addProject, removeProject, updateProject, selectProject } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [directoryBrowserVisible, setDirectoryBrowserVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [form] = Form.useForm();
  const message = useMessage();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectList = await tauriCommands.getProjects();
      // 如果后端返回了项目，更新store
      // 目前后端返回空数组，所以这里暂时不做处理
    } catch (error) {
      message.error('加载项目列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportProject = async () => {
    if (isTauriEnvironment()) {
      // Tauri 环境，使用原生文件对话框
      try {
        const { open } = await import('@tauri-apps/api/dialog');
        const result = await open({
          directory: true,
          multiple: false,
          title: '选择PHP项目文件夹'
        });

        if (result && typeof result === 'string') {
          const project = await tauriCommands.importPhpProject(result);
          addProject(project);
          message.success('项目导入成功');
        }
      } catch (error) {
        message.error('项目导入失败');
        console.error(error);
      }
    } else {
      // 浏览器环境，使用目录浏览器
      setDirectoryBrowserVisible(true);
    }
  };

  const handleDirectorySelect = async (path: string) => {
    try {
      setDirectoryBrowserVisible(false);
      const project = await tauriCommands.importPhpProject(path);
      addProject(project);
      message.success(`项目导入成功: ${project.name}`);
    } catch (error) {
      message.error('项目导入失败');
      console.error(error);
    }
  };

  const handleStartServer = async (project: any) => {
    try {
      // 获取可用端口
      const port = await tauriCommands.getAvailablePort();
      const result = await tauriCommands.startPhpServer(project.path, port);
      updateProject(project.id, { server_port: port, is_running: true });
      message.success(result);

      // 询问是否在浏览器中打开
      setTimeout(() => {
        const openInBrowser = window.confirm(`服务器已启动在端口 ${port}，是否在浏览器中打开？`);
        if (openInBrowser) {
          window.open(`http://localhost:${port}`, '_blank');
        }
      }, 1000);
    } catch (error) {
      message.error(`启动服务器失败: ${error}`);
      console.error(error);
    }
  };

  const handleStopServer = async (project: any) => {
    try {
      if (project.server_port) {
        const result = await tauriCommands.stopPhpServer(project.server_port);
        updateProject(project.id, { server_port: undefined, is_running: false });
        message.success(result);
      }
    } catch (error) {
      message.error(`停止服务器失败: ${error}`);
      console.error(error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      removeProject(projectId);
      message.success('项目已删除');
    } catch (error) {
      message.error('删除项目失败');
      console.error(error);
    }
  };

  const handleOpenConfig = (project: any) => {
    setSelectedProject(project);
    setConfigModalVisible(true);
  };

  const handleSaveConfig = (config: any) => {
    if (selectedProject) {
      updateProject(selectedProject.id, {
        ...config,
        last_modified: new Date().toISOString()
      });
      setConfigModalVisible(false);
      setSelectedProject(null);
      message.success('项目配置已保存');
    }
  };



  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Title level={2} style={{ margin: 0 }}>项目管理</Title>
          <EnvironmentIndicator />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleImportProject}
        >
          导入项目
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <Empty
            description="暂无项目"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleImportProject}>
              导入第一个项目
            </Button>
          </Empty>
        </Card>
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={projects}
          loading={loading}
          renderItem={(project) => (
            <List.Item>
              <Card
                className="project-card"
                title={
                  <Space>
                    <FolderOpenOutlined />
                    {project.name}
                    <Tag color={getProjectTypeColor(project.project_type)}>
                      {project.project_type}
                    </Tag>
                  </Space>
                }
                extra={
                  <Space>
                    {project.is_running ? (
                      <Button
                        type="text"
                        danger
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleStopServer(project)}
                        title={`停止服务器 (端口: ${project.server_port})`}
                      >
                        停止
                      </Button>
                    ) : (
                      <Button
                        type="text"
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleStartServer(project)}
                        title="启动调试服务器"
                      >
                        启动
                      </Button>
                    )}
                    <Button
                      type="text"
                      icon={<SettingOutlined />}
                      onClick={() => handleOpenConfig(project)}
                      title="项目设置"
                    />
                    <Popconfirm
                      title="确定要删除这个项目吗？"
                      onConfirm={() => handleDeleteProject(project.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        title="删除项目"
                      />
                    </Popconfirm>
                  </Space>
                }
              >
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">路径: </Text>
                  <Text code>{project.path}</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">入口文件: </Text>
                  <Text>{project.entry_file}</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">创建时间: </Text>
                  <Text>{new Date(project.created_at).toLocaleString()}</Text>
                </div>
                {project.is_running && (
                  <div>
                    <Text type="secondary">服务器状态: </Text>
                    <Tag color="green">运行中 (端口: {project.server_port})</Tag>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => window.open(`http://localhost:${project.server_port}`, '_blank')}
                    >
                      在浏览器中打开
                    </Button>
                  </div>
                )}
              </Card>
            </List.Item>
          )}
        />
      )}

      <ProjectConfigModal
        visible={configModalVisible}
        project={selectedProject}
        onCancel={() => {
          setConfigModalVisible(false);
          setSelectedProject(null);
        }}
        onSave={handleSaveConfig}
      />

      <DirectoryBrowser
        visible={directoryBrowserVisible}
        onCancel={() => setDirectoryBrowserVisible(false)}
        onSelect={handleDirectorySelect}
      />
    </div>
  );
};

export default ProjectManager;
