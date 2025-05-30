import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Typography,
  Space,
  Upload,
  InputNumber,
  Divider,
  message,
  Row,
  Col,
  Tabs
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  SettingOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BranchesOutlined,
  DashboardOutlined,
  ApiOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import AdvancedBuildConfig from '../components/AdvancedBuildConfig';
import TeamManagement from '../components/TeamManagement';
import VersionControl from '../components/VersionControl';
import PerformanceMonitor from '../components/PerformanceMonitor';
import DependencyManager from '../components/DependencyManager';
import RealTimeCollaboration from '../components/RealTimeCollaboration';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface BuildConfig {
  appName: string;
  appVersion: string;
  appDescription: string;
  appIcon?: string;
  targetPlatforms: string[];
  windowWidth: number;
  windowHeight: number;
  windowResizable: boolean;
  windowFullscreen: boolean;
  phpVersion: string;
  outputDir: string;
  includePhpExtensions: string[];
  customCommands: string;
}

const BuildConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const platformOptions = [
    { label: 'Windows (x64)', value: 'windows-x64' },
    { label: 'macOS (Intel)', value: 'macos-x64' },
    { label: 'macOS (Apple Silicon)', value: 'macos-arm64' },
    { label: 'Linux (x64)', value: 'linux-x64' },
  ];

  const phpVersionOptions = [
    { label: 'PHP 8.3', value: '8.3' },
    { label: 'PHP 8.2', value: '8.2' },
    { label: 'PHP 8.1', value: '8.1' },
    { label: 'PHP 8.0', value: '8.0' },
    { label: 'PHP 7.4', value: '7.4' },
  ];

  const phpExtensions = [
    'curl', 'gd', 'mbstring', 'mysqli', 'pdo', 'pdo_mysql',
    'pdo_sqlite', 'openssl', 'zip', 'xml', 'json', 'fileinfo'
  ];

  const handleSaveConfig = async (values: BuildConfig) => {
    try {
      setLoading(true);
      // TODO: Save configuration to Tauri backend
      console.log('保存配置:', values);
      message.success('配置保存成功');
    } catch (error) {
      message.error('保存配置失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIconUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success('图标上传成功');
    } else if (info.file.status === 'error') {
      message.error('图标上传失败');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>项目配置与管理</Title>
        <Text type="secondary">完整的项目配置、团队协作、版本控制和性能监控</Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* 基础配置 */}
        <TabPane tab={<><SettingOutlined /> 基础配置</>} key="basic">
          <BasicConfigForm
            form={form}
            loading={loading}
            onSave={handleSaveConfig}
            platformOptions={platformOptions}
            phpVersionOptions={phpVersionOptions}
            phpExtensions={phpExtensions}
            handleIconUpload={handleIconUpload}
          />
        </TabPane>

        {/* 高级配置 */}
        <TabPane tab={<><ThunderboltOutlined /> 高级配置</>} key="advanced">
          <AdvancedBuildConfig onSave={(config) => console.log('高级配置:', config)} />
        </TabPane>

        {/* 依赖管理 */}
        <TabPane tab={<><ApiOutlined /> 依赖管理</>} key="dependencies">
          <DependencyManager
            projectPath="/path/to/project"
            onDependencyChange={(deps) => console.log('依赖变更:', deps)}
          />
        </TabPane>

        {/* 团队管理 */}
        <TabPane tab={<><TeamOutlined /> 团队管理</>} key="team">
          <TeamManagement />
        </TabPane>

        {/* 版本控制 */}
        <TabPane tab={<><BranchesOutlined /> 版本控制</>} key="version">
          <VersionControl
            projectPath="/path/to/project"
            onRepositoryChange={(repo) => console.log('仓库变更:', repo)}
          />
        </TabPane>

        {/* 实时协作 */}
        <TabPane tab={<><TeamOutlined /> 实时协作</>} key="collaboration">
          <RealTimeCollaboration
            projectId="project-1"
            currentUser={{
              id: 'user-1',
              name: '当前用户',
              avatar: ''
            }}
          />
        </TabPane>

        {/* 性能监控 */}
        <TabPane tab={<><DashboardOutlined /> 性能监控</>} key="performance">
          <PerformanceMonitor />
        </TabPane>
      </Tabs>
    </div>
  );
};

// 基础配置表单组件
const BasicConfigForm: React.FC<{
  form: any;
  loading: boolean;
  onSave: (values: any) => void;
  platformOptions: any[];
  phpVersionOptions: any[];
  phpExtensions: string[];
  handleIconUpload: (info: any) => void;
}> = ({ form, loading, onSave, platformOptions, phpVersionOptions, phpExtensions, handleIconUpload }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSave}
        initialValues={{
          appName: 'My PHP App',
          appVersion: '1.0.0',
          targetPlatforms: ['windows-x64'],
          windowWidth: 1200,
          windowHeight: 800,
          windowResizable: true,
          windowFullscreen: false,
          phpVersion: '8.2',
          outputDir: './dist',
          includePhpExtensions: ['curl', 'gd', 'mbstring', 'mysqli', 'pdo']
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Card title={<><AppstoreOutlined /> 应用信息</>} className="config-section">
              <Form.Item
                label="应用名称"
                name="appName"
                rules={[{ required: true, message: '请输入应用名称' }]}
              >
                <Input placeholder="输入应用名称" />
              </Form.Item>

              <Form.Item
                label="应用版本"
                name="appVersion"
                rules={[{ required: true, message: '请输入应用版本' }]}
              >
                <Input placeholder="例如: 1.0.0" />
              </Form.Item>

              <Form.Item
                label="应用描述"
                name="appDescription"
              >
                <TextArea rows={3} placeholder="输入应用描述" />
              </Form.Item>

              <Form.Item label="应用图标" name="appIcon">
                <Upload
                  accept=".png,.jpg,.jpeg,.ico"
                  showUploadList={false}
                  onChange={handleIconUpload}
                >
                  <Button icon={<UploadOutlined />}>选择图标文件</Button>
                </Upload>
                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  支持 PNG、JPG、ICO 格式，建议尺寸 256x256
                </Text>
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="窗口设置" className="config-section">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="窗口宽度" name="windowWidth">
                    <InputNumber min={400} max={2560} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="窗口高度" name="windowHeight">
                    <InputNumber min={300} max={1440} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="windowResizable" valuePropName="checked">
                <Checkbox>允许调整窗口大小</Checkbox>
              </Form.Item>

              <Form.Item name="windowFullscreen" valuePropName="checked">
                <Checkbox>启动时全屏显示</Checkbox>
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Card title="目标平台" className="config-section">
          <Form.Item
            label="选择目标平台"
            name="targetPlatforms"
            rules={[{ required: true, message: '请至少选择一个目标平台' }]}
          >
            <Checkbox.Group options={platformOptions} />
          </Form.Item>
        </Card>

        <Row gutter={24}>
          <Col span={12}>
            <Card title="PHP 配置" className="config-section">
              <Form.Item
                label="PHP 版本"
                name="phpVersion"
                rules={[{ required: true, message: '请选择PHP版本' }]}
              >
                <Select placeholder="选择PHP版本">
                  {phpVersionOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="包含的PHP扩展"
                name="includePhpExtensions"
              >
                <Checkbox.Group>
                  <Row>
                    {phpExtensions.map(ext => (
                      <Col span={8} key={ext}>
                        <Checkbox value={ext}>{ext}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="输出设置" className="config-section">
              <Form.Item
                label="输出目录"
                name="outputDir"
                rules={[{ required: true, message: '请输入输出目录' }]}
              >
                <Input placeholder="例如: ./dist" />
              </Form.Item>

              <Form.Item
                label="自定义构建命令"
                name="customCommands"
              >
                <TextArea
                  rows={4}
                  placeholder="输入构建前需要执行的自定义命令，每行一个命令"
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Space>
            <Button size="large">
              重置配置
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
            >
              保存配置
            </Button>
          </Space>
        </div>
      </Form>
  );
};

export default BuildConfig;
