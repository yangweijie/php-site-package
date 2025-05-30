import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Typography,
  Space,
  Tabs,
  List,
  Tag,
  Upload,
  Progress,
  Alert,
  Divider,
  Row,
  Col,
  Tooltip,
  Modal
} from 'antd';
import {
  CloudUploadOutlined,
  RobotOutlined,
  TeamOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface AdvancedBuildConfigProps {
  onSave: (config: any) => void;
  initialConfig?: any;
}

const AdvancedBuildConfig: React.FC<AdvancedBuildConfigProps> = ({
  onSave,
  initialConfig = {}
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('installer');

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      console.error('保存配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="高级构建配置" style={{ marginTop: 24 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          // 安装包配置
          generateInstaller: true,
          installerType: 'msi',
          includeUninstaller: true,
          autoUpdate: false,
          
          // 云构建配置
          enableCloudBuild: false,
          cloudProvider: 'github',
          buildTrigger: 'manual',
          
          // AI优化配置
          enableAIOptimization: false,
          optimizationLevel: 'balanced',
          autoOptimize: false,
          
          // 企业功能
          enableTeamFeatures: false,
          projectSharing: false,
          buildHistory: true,
          
          ...initialConfig
        }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 安装包生成 */}
          <TabPane tab={<><UploadOutlined /> 安装包生成</>} key="installer">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Alert
                message="安装包生成"
                description="为不同平台生成专业的安装程序，包含自动更新、卸载程序等功能。"
                type="info"
                showIcon
              />

              <Row gutter={24}>
                <Col span={12}>
                  <Card size="small" title="基础配置">
                    <Form.Item name="generateInstaller" valuePropName="checked">
                      <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                      <span style={{ marginLeft: 8 }}>生成安装包</span>
                    </Form.Item>

                    <Form.Item label="安装包类型" name="installerType">
                      <Select placeholder="选择安装包类型">
                        <Option value="msi">Windows MSI</Option>
                        <Option value="exe">Windows EXE</Option>
                        <Option value="dmg">macOS DMG</Option>
                        <Option value="pkg">macOS PKG</Option>
                        <Option value="deb">Linux DEB</Option>
                        <Option value="rpm">Linux RPM</Option>
                        <Option value="appimage">Linux AppImage</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item name="includeUninstaller" valuePropName="checked">
                      <Switch />
                      <span style={{ marginLeft: 8 }}>包含卸载程序</span>
                    </Form.Item>

                    <Form.Item name="autoUpdate" valuePropName="checked">
                      <Switch />
                      <span style={{ marginLeft: 8 }}>自动更新功能</span>
                    </Form.Item>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card size="small" title="签名和认证">
                    <Form.Item label="代码签名证书" name="codeSignCert">
                      <Upload>
                        <Button icon={<UploadOutlined />}>上传证书</Button>
                      </Upload>
                    </Form.Item>

                    <Form.Item label="证书密码" name="certPassword">
                      <Input.Password placeholder="证书密码" />
                    </Form.Item>

                    <Form.Item name="enableNotarization" valuePropName="checked">
                      <Switch />
                      <span style={{ marginLeft: 8 }}>macOS公证</span>
                    </Form.Item>
                  </Card>
                </Col>
              </Row>

              <Card size="small" title="安装选项">
                <Form.Item label="安装路径" name="installPath">
                  <Input placeholder="默认安装路径" />
                </Form.Item>

                <Form.Item label="开始菜单文件夹" name="startMenuFolder">
                  <Input placeholder="开始菜单文件夹名称" />
                </Form.Item>

                <Form.Item name="createDesktopShortcut" valuePropName="checked">
                  <Switch />
                  <span style={{ marginLeft: 8 }}>创建桌面快捷方式</span>
                </Form.Item>

                <Form.Item name="addToPath" valuePropName="checked">
                  <Switch />
                  <span style={{ marginLeft: 8 }}>添加到系统PATH</span>
                </Form.Item>
              </Card>
            </Space>
          </TabPane>

          {/* 云构建支持 */}
          <TabPane tab={<><CloudUploadOutlined /> 云构建</>} key="cloud">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Alert
                message="云构建服务"
                description="使用云端资源进行项目构建，支持多平台并行构建，提高构建效率。"
                type="info"
                showIcon
              />

              <Card size="small" title="云服务配置">
                <Form.Item name="enableCloudBuild" valuePropName="checked">
                  <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  <span style={{ marginLeft: 8 }}>启用云构建</span>
                </Form.Item>

                <Form.Item label="云服务提供商" name="cloudProvider">
                  <Select placeholder="选择云服务提供商">
                    <Option value="github">GitHub Actions</Option>
                    <Option value="gitlab">GitLab CI</Option>
                    <Option value="azure">Azure DevOps</Option>
                    <Option value="aws">AWS CodeBuild</Option>
                    <Option value="custom">自定义服务</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="构建触发方式" name="buildTrigger">
                  <Select placeholder="选择触发方式">
                    <Option value="manual">手动触发</Option>
                    <Option value="push">代码推送</Option>
                    <Option value="tag">标签创建</Option>
                    <Option value="schedule">定时构建</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="API密钥" name="cloudApiKey">
                  <Input.Password placeholder="云服务API密钥" />
                </Form.Item>
              </Card>

              <Card size="small" title="构建配置">
                <Form.Item label="并行构建数" name="parallelBuilds">
                  <Select defaultValue="3">
                    <Option value="1">1个平台</Option>
                    <Option value="2">2个平台</Option>
                    <Option value="3">3个平台</Option>
                    <Option value="4">4个平台</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="构建超时(分钟)" name="buildTimeout">
                  <Input type="number" defaultValue="30" />
                </Form.Item>

                <Form.Item name="enableBuildCache" valuePropName="checked">
                  <Switch defaultChecked />
                  <span style={{ marginLeft: 8 }}>启用构建缓存</span>
                </Form.Item>

                <Form.Item name="notifyOnComplete" valuePropName="checked">
                  <Switch />
                  <span style={{ marginLeft: 8 }}>构建完成通知</span>
                </Form.Item>
              </Card>
            </Space>
          </TabPane>

          {/* AI辅助功能 */}
          <TabPane tab={<><RobotOutlined /> AI辅助</>} key="ai">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Alert
                message="AI智能优化"
                description="使用人工智能技术分析项目结构，提供优化建议和自动化配置。"
                type="info"
                showIcon
              />

              <Card size="small" title="智能分析">
                <Form.Item name="enableAIOptimization" valuePropName="checked">
                  <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  <span style={{ marginLeft: 8 }}>AI优化建议</span>
                </Form.Item>

                <Form.Item label="优化级别" name="optimizationLevel">
                  <Select placeholder="选择优化级别">
                    <Option value="conservative">保守优化</Option>
                    <Option value="balanced">平衡优化</Option>
                    <Option value="aggressive">激进优化</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="autoOptimize" valuePropName="checked">
                  <Switch />
                  <span style={{ marginLeft: 8 }}>自动应用优化</span>
                </Form.Item>
              </Card>

              <Card size="small" title="智能功能">
                <List
                  size="small"
                  dataSource={[
                    { title: '代码质量分析', desc: '检测潜在的代码问题和安全漏洞' },
                    { title: '性能优化建议', desc: '分析性能瓶颈，提供优化方案' },
                    { title: '依赖优化', desc: '智能管理和优化项目依赖' },
                    { title: '配置推荐', desc: '根据项目特点推荐最佳配置' }
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title}
                        description={item.desc}
                      />
                      <Switch size="small" />
                    </List.Item>
                  )}
                />
              </Card>
            </Space>
          </TabPane>

          {/* 企业功能 */}
          <TabPane tab={<><TeamOutlined /> 企业功能</>} key="enterprise">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Alert
                message="企业级功能"
                description="面向团队和企业的协作功能，包括项目分享、权限管理、构建历史等。"
                type="info"
                showIcon
              />

              <Card size="small" title="团队协作">
                <Form.Item name="enableTeamFeatures" valuePropName="checked">
                  <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  <span style={{ marginLeft: 8 }}>团队功能</span>
                </Form.Item>

                <Form.Item name="projectSharing" valuePropName="checked">
                  <Switch />
                  <span style={{ marginLeft: 8 }}>项目分享</span>
                </Form.Item>

                <Form.Item label="团队成员" name="teamMembers">
                  <Select mode="tags" placeholder="添加团队成员邮箱">
                    <Option value="user1@example.com">user1@example.com</Option>
                    <Option value="user2@example.com">user2@example.com</Option>
                  </Select>
                </Form.Item>
              </Card>

              <Card size="small" title="项目管理">
                <Form.Item name="buildHistory" valuePropName="checked">
                  <Switch defaultChecked />
                  <span style={{ marginLeft: 8 }}>构建历史记录</span>
                </Form.Item>

                <Form.Item name="versionControl" valuePropName="checked">
                  <Switch />
                  <span style={{ marginLeft: 8 }}>版本控制集成</span>
                </Form.Item>

                <Form.Item name="deploymentPipeline" valuePropName="checked">
                  <Switch />
                  <span style={{ marginLeft: 8 }}>部署流水线</span>
                </Form.Item>

                <Form.Item label="项目模板" name="projectTemplates">
                  <Select mode="multiple" placeholder="选择可用模板">
                    <Option value="laravel">Laravel模板</Option>
                    <Option value="wordpress">WordPress模板</Option>
                    <Option value="symfony">Symfony模板</Option>
                  </Select>
                </Form.Item>
              </Card>

              <Card size="small" title="权限管理">
                <List
                  size="small"
                  dataSource={[
                    { role: '管理员', permissions: ['所有权限'] },
                    { role: '开发者', permissions: ['构建', '配置', '调试'] },
                    { role: '查看者', permissions: ['查看项目', '下载构建'] }
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.role}
                        description={
                          <Space>
                            {item.permissions.map(perm => (
                              <Tag key={perm} size="small">{perm}</Tag>
                            ))}
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Space>
          </TabPane>
        </Tabs>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button size="large">
              重置配置
            </Button>
            <Button 
              type="primary" 
              size="large"
              icon={<SettingOutlined />}
              onClick={handleSave}
              loading={loading}
            >
              保存高级配置
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default AdvancedBuildConfig;
