import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Tabs,
  Card,
  Space,
  Divider,
  Tag,
  Upload,
  InputNumber
} from 'antd';
import { useMessage } from '../hooks/useMessage';
import {
  SettingOutlined,
  FolderOutlined,
  CodeOutlined,
  GlobalOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { PhpProject } from '../store/useProjectStore';

const { Option } = Select;
const { TextArea } = Input;

interface ProjectConfigModalProps {
  visible: boolean;
  project: PhpProject | null;
  onCancel: () => void;
  onSave: (config: ProjectConfig) => void;
}

interface ProjectConfig {
  // 基础配置
  name: string;
  description: string;
  version: string;
  author: string;

  // PHP配置
  phpVersion: string;
  entryFile: string;
  includePaths: string[];
  excludePaths: string[];

  // 服务器配置
  defaultPort: number;
  documentRoot: string;
  enableRewrite: boolean;
  customHeaders: Record<string, string>;

  // 开发配置
  enableHotReload: boolean;
  watchPatterns: string[];
  buildCommand: string;
  testCommand: string;

  // 环境变量
  envVars: Record<string, string>;
}

const ProjectConfigModal: React.FC<ProjectConfigModalProps> = ({
  visible,
  project,
  onCancel,
  onSave
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const message = useMessage();

  useEffect(() => {
    if (visible && project) {
      // 初始化表单数据
      form.setFieldsValue({
        name: project.name,
        description: '',
        version: '1.0.0',
        author: '',
        phpVersion: '8.2',
        entryFile: project.entry_file,
        includePaths: [],
        excludePaths: ['node_modules', '.git', 'vendor'],
        defaultPort: 8000,
        documentRoot: '.',
        enableRewrite: true,
        customHeaders: {},
        enableHotReload: true,
        watchPatterns: ['*.php', '*.html', '*.css', '*.js'],
        buildCommand: '',
        testCommand: '',
        envVars: {}
      });
    }
  }, [visible, project, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSave(values);
      message.success('项目配置已保存');
    } catch (error) {
      message.error('保存配置失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const phpVersionOptions = [
    { label: 'PHP 8.3', value: '8.3' },
    { label: 'PHP 8.2', value: '8.2' },
    { label: 'PHP 8.1', value: '8.1' },
    { label: 'PHP 8.0', value: '8.0' },
    { label: 'PHP 7.4', value: '7.4' },
  ];

  const tabItems = [
    {
      key: 'basic',
      label: (
        <>
          <FolderOutlined /> 基础信息
        </>
      ),
      children: (
        <Card size="small">
          <Form.Item label="项目名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="输入项目名称" />
          </Form.Item>

          <Form.Item label="项目描述" name="description">
            <TextArea rows={3} placeholder="输入项目描述" />
          </Form.Item>

          <Form.Item label="版本号" name="version">
            <Input placeholder="例如: 1.0.0" />
          </Form.Item>

          <Form.Item label="作者" name="author">
            <Input placeholder="输入作者信息" />
          </Form.Item>
        </Card>
      )
    },
    {
      key: 'php',
      label: (
        <>
          <CodeOutlined /> PHP配置
        </>
      ),
      children: (
        <Card size="small">
          <Form.Item label="PHP版本" name="phpVersion">
            <Select placeholder="选择PHP版本">
              {phpVersionOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="入口文件" name="entryFile">
            <Input placeholder="例如: index.php" />
          </Form.Item>

          <Form.Item label="包含路径" name="includePaths">
            <Select
              mode="tags"
              placeholder="添加要包含的路径"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="排除路径" name="excludePaths">
            <Select
              mode="tags"
              placeholder="添加要排除的路径"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Card>
      )
    },
    {
      key: 'server',
      label: (
        <>
          <GlobalOutlined /> 服务器配置
        </>
      ),
      children: (
        <Card size="small">
          <Form.Item label="默认端口" name="defaultPort">
            <InputNumber min={1000} max={65535} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="文档根目录" name="documentRoot">
            <Input placeholder="例如: public" />
          </Form.Item>

          <Form.Item name="enableRewrite" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            <span style={{ marginLeft: 8 }}>URL重写</span>
          </Form.Item>

          <Form.Item label="自定义头部" name="customHeaders">
            <TextArea
              rows={4}
              placeholder="JSON格式，例如: {&quot;Access-Control-Allow-Origin&quot;: &quot;*&quot;}"
            />
          </Form.Item>
        </Card>
      )
    },
    {
      key: 'dev',
      label: '开发配置',
      children: (
        <Card size="small">
          <Form.Item name="enableHotReload" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            <span style={{ marginLeft: 8 }}>热重载</span>
          </Form.Item>

          <Form.Item label="监听模式" name="watchPatterns">
            <Select
              mode="tags"
              placeholder="添加文件监听模式"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="构建命令" name="buildCommand">
            <Input placeholder="例如: composer install" />
          </Form.Item>

          <Form.Item label="测试命令" name="testCommand">
            <Input placeholder="例如: phpunit" />
          </Form.Item>
        </Card>
      )
    },
    {
      key: 'env',
      label: '环境变量',
      children: (
        <Card size="small">
          <Form.Item label="环境变量" name="envVars">
            <TextArea
              rows={8}
              placeholder="JSON格式，例如:&#10;{&#10;  &quot;DB_HOST&quot;: &quot;localhost&quot;,&#10;  &quot;DB_NAME&quot;: &quot;myapp&quot;&#10;}"
            />
          </Form.Item>
        </Card>
      )
    }
  ];

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          项目配置 - {project?.name}
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSave}>
          保存配置
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Form>
    </Modal>
  );
};

export default ProjectConfigModal;
