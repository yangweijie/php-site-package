import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Typography,
  Tabs,
  List,
  Progress,
  Alert
} from 'antd';
import { useMessage } from '../hooks/useMessage';
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { Option } = Select;


interface Dependency {
  name: string;
  version: string;
  type: 'require' | 'require-dev';
  description?: string;
  status: 'installed' | 'missing' | 'outdated';
  latestVersion?: string;
}

interface DependencyManagerProps {
  projectPath: string;
  onDependencyChange?: (dependencies: Dependency[]) => void;
}

const DependencyManager: React.FC<DependencyManagerProps> = ({
  projectPath,
  onDependencyChange
}) => {
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [form] = Form.useForm();
  const message = useMessage();

  useEffect(() => {
    loadDependencies();
  }, [projectPath]);

  const loadDependencies = async () => {
    try {
      setLoading(true);
      // TODO: 调用Tauri命令获取依赖信息
      const mockDependencies: Dependency[] = [
        {
          name: 'laravel/framework',
          version: '^9.0',
          type: 'require',
          description: 'The Laravel Framework',
          status: 'installed',
          latestVersion: '9.52.0'
        },
        {
          name: 'guzzlehttp/guzzle',
          version: '^7.0',
          type: 'require',
          description: 'Guzzle HTTP client library',
          status: 'installed',
          latestVersion: '7.8.0'
        },
        {
          name: 'phpunit/phpunit',
          version: '^9.0',
          type: 'require-dev',
          description: 'The PHP Unit Testing framework',
          status: 'outdated',
          latestVersion: '9.6.0'
        },
        {
          name: 'symfony/console',
          version: '^6.0',
          type: 'require',
          description: 'Symfony Console Component',
          status: 'missing'
        }
      ];

      setDependencies(mockDependencies);
      onDependencyChange?.(mockDependencies);
    } catch (error) {
      message.error('加载依赖信息失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallDependencies = async () => {
    try {
      setIsInstalling(true);
      setInstallProgress(0);

      // 模拟安装过程
      const steps = [
        'Downloading packages...',
        'Installing dependencies...',
        'Generating autoload files...',
        'Optimizing autoloader...',
        'Installation complete!'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInstallProgress((i + 1) / steps.length * 100);
        message.info(steps[i]);
      }

      // 更新依赖状态
      setDependencies(prev => prev.map(dep => ({
        ...dep,
        status: dep.status === 'missing' ? 'installed' : dep.status
      })));

      message.success('依赖安装完成');
    } catch (error) {
      message.error('依赖安装失败');
      console.error(error);
    } finally {
      setIsInstalling(false);
      setInstallProgress(0);
    }
  };

  const handleAddDependency = async (values: any) => {
    try {
      const newDep: Dependency = {
        name: values.name,
        version: values.version,
        type: values.type,
        description: values.description,
        status: 'missing'
      };

      setDependencies(prev => [...prev, newDep]);
      setModalVisible(false);
      form.resetFields();
      message.success('依赖已添加');
    } catch (error) {
      message.error('添加依赖失败');
      console.error(error);
    }
  };

  const handleRemoveDependency = async (name: string) => {
    try {
      setDependencies(prev => prev.filter(dep => dep.name !== name));
      message.success('依赖已移除');
    } catch (error) {
      message.error('移除依赖失败');
      console.error(error);
    }
  };

  const handleUpdateDependency = async (name: string) => {
    try {
      setDependencies(prev => prev.map(dep =>
        dep.name === name
          ? { ...dep, status: 'installed', version: dep.latestVersion || dep.version }
          : dep
      ));
      message.success(`${name} 已更新`);
    } catch (error) {
      message.error('更新依赖失败');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'installed': return 'green';
      case 'missing': return 'red';
      case 'outdated': return 'orange';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'installed': return <CheckCircleOutlined />;
      case 'missing': return <ExclamationCircleOutlined />;
      case 'outdated': return <InfoCircleOutlined />;
      default: return null;
    }
  };

  const columns = [
    {
      title: '包名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Dependency) => (
        <Space direction="vertical" size="small">
          <Text strong>{name}</Text>
          {record.description && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.description}
            </Text>
          )}
        </Space>
      )
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version: string, record: Dependency) => (
        <Space direction="vertical" size="small">
          <Text>{version}</Text>
          {record.latestVersion && record.status === 'outdated' && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              最新: {record.latestVersion}
            </Text>
          )}
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'require' ? 'blue' : 'purple'}>
          {type === 'require' ? '生产依赖' : '开发依赖'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status === 'installed' ? '已安装' :
           status === 'missing' ? '缺失' : '需更新'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: Dependency) => (
        <Space>
          {record.status === 'outdated' && (
            <Button
              type="link"
              size="small"
              onClick={() => handleUpdateDependency(record.name)}
            >
              更新
            </Button>
          )}
          <Popconfirm
            title="确定要移除这个依赖吗？"
            onConfirm={() => handleRemoveDependency(record.name)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              移除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const requireDeps = dependencies.filter(dep => dep.type === 'require');
  const devDeps = dependencies.filter(dep => dep.type === 'require-dev');
  const missingCount = dependencies.filter(dep => dep.status === 'missing').length;
  const outdatedCount = dependencies.filter(dep => dep.status === 'outdated').length;

  return (
    <Card
      title="依赖管理"
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadDependencies}
            loading={loading}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            添加依赖
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleInstallDependencies}
            loading={isInstalling}
            disabled={missingCount === 0}
          >
            安装依赖 {missingCount > 0 && `(${missingCount})`}
          </Button>
        </Space>
      }
    >
      {/* 状态概览 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Tag color="blue">总计: {dependencies.length}</Tag>
          <Tag color="green">已安装: {dependencies.filter(d => d.status === 'installed').length}</Tag>
          {missingCount > 0 && <Tag color="red">缺失: {missingCount}</Tag>}
          {outdatedCount > 0 && <Tag color="orange">需更新: {outdatedCount}</Tag>}
        </Space>
      </div>

      {/* 安装进度 */}
      {isInstalling && (
        <Alert
          message="正在安装依赖..."
          description={
            <Progress
              percent={Math.round(installProgress)}
              status="active"
              style={{ marginTop: 8 }}
            />
          }
          type="info"
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 依赖列表 */}
      <Tabs
        defaultActiveKey="require"
        items={[
          {
            key: 'require',
            label: `生产依赖 (${requireDeps.length})`,
            children: (
              <Table
                columns={columns}
                dataSource={requireDeps}
                rowKey="name"
                size="small"
                pagination={false}
              />
            )
          },
          {
            key: 'require-dev',
            label: `开发依赖 (${devDeps.length})`,
            children: (
              <Table
                columns={columns}
                dataSource={devDeps}
                rowKey="name"
                size="small"
                pagination={false}
              />
            )
          }
        ]}
      />

      {/* 添加依赖模态框 */}
      <Modal
        title="添加依赖"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDependency}
        >
          <Form.Item
            label="包名"
            name="name"
            rules={[{ required: true, message: '请输入包名' }]}
          >
            <Input placeholder="例如: guzzlehttp/guzzle" />
          </Form.Item>

          <Form.Item
            label="版本"
            name="version"
            rules={[{ required: true, message: '请输入版本' }]}
          >
            <Input placeholder="例如: ^7.0" />
          </Form.Item>

          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="选择依赖类型">
              <Option value="require">生产依赖</Option>
              <Option value="require-dev">开发依赖</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input placeholder="可选的包描述" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DependencyManager;
