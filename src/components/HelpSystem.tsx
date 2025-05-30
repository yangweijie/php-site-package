import React, { useState } from 'react';
import {
  Drawer,
  Tabs,
  Card,
  Typography,
  Space,
  Button,
  Input,
  List,
  Tag,
  Collapse,
  Steps,
  Alert,
  Divider
} from 'antd';
import {
  QuestionCircleOutlined,
  BookOutlined,
  RocketOutlined,
  SettingOutlined,
  BugOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Step } = Steps;
const { Search } = Input;

interface HelpSystemProps {
  visible: boolean;
  onClose: () => void;
}

const HelpSystem: React.FC<HelpSystemProps> = ({ visible, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('guide');

  const quickStartSteps = [
    {
      title: '导入PHP项目',
      description: '点击"导入项目"按钮，选择您的PHP项目文件夹',
      icon: <PlayCircleOutlined />
    },
    {
      title: '配置项目',
      description: '点击项目卡片上的设置按钮，配置项目参数',
      icon: <SettingOutlined />
    },
    {
      title: '启动调试',
      description: '在调试控制台启动PHP服务器进行测试',
      icon: <BugOutlined />
    },
    {
      title: '配置打包',
      description: '在打包配置页面设置应用信息和目标平台',
      icon: <SettingOutlined />
    },
    {
      title: '构建应用',
      description: '在构建分发页面一键生成桌面应用',
      icon: <RocketOutlined />
    }
  ];

  const faqData = [
    {
      question: '支持哪些PHP框架？',
      answer: '目前支持Laravel、WordPress、Symfony、CodeIgniter、Drupal、CakePHP等主流框架，以及原生PHP项目。'
    },
    {
      question: '如何解决PHP服务器启动失败？',
      answer: '请确保系统已安装PHP并添加到PATH环境变量中。可以在终端运行 "php --version" 检查PHP是否正确安装。'
    },
    {
      question: '打包后的应用如何分发？',
      answer: '打包完成后会在输出目录生成对应平台的可执行文件，可以直接分发给用户运行。'
    },
    {
      question: '如何添加自定义PHP扩展？',
      answer: '在打包配置页面的PHP配置部分，可以选择需要包含的PHP扩展。'
    },
    {
      question: '支持哪些操作系统？',
      answer: '支持Windows (x64)、macOS (Intel/Apple Silicon)、Linux (x64)等主流操作系统。'
    }
  ];

  const troubleshootingData = [
    {
      title: '项目导入失败',
      content: [
        '检查项目路径是否正确',
        '确保项目文件夹包含PHP文件',
        '检查文件夹权限是否允许读取'
      ]
    },
    {
      title: 'PHP服务器无法启动',
      content: [
        '确认PHP已正确安装',
        '检查端口是否被占用',
        '查看错误日志获取详细信息'
      ]
    },
    {
      title: '构建过程失败',
      content: [
        '检查项目配置是否正确',
        '确保有足够的磁盘空间',
        '查看构建日志定位问题'
      ]
    }
  ];

  const keyboardShortcuts = [
    { key: 'Ctrl/Cmd + N', action: '导入新项目' },
    { key: 'Ctrl/Cmd + R', action: '刷新项目列表' },
    { key: 'Ctrl/Cmd + D', action: '打开调试控制台' },
    { key: 'Ctrl/Cmd + B', action: '开始构建' },
    { key: 'F1', action: '打开帮助' },
    { key: 'Esc', action: '关闭模态框' }
  ];

  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(searchText.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Drawer
      title={
        <Space>
          <QuestionCircleOutlined />
          帮助中心
        </Space>
      }
      placement="right"
      width={600}
      open={visible}
      onClose={onClose}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* 快速入门 */}
        <TabPane tab={<><RocketOutlined /> 快速入门</>} key="guide">
          <Card>
            <Title level={4}>欢迎使用 PHP Desktop Packager</Title>
            <Paragraph>
              PHP Desktop Packager 是一个专业的桌面应用程序，用于将 PHP 项目打包为独立的客户端应用。
              按照以下步骤快速开始：
            </Paragraph>
            
            <Steps direction="vertical" size="small" current={-1}>
              {quickStartSteps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                />
              ))}
            </Steps>

            <Alert
              message="提示"
              description="首次使用建议先导入一个简单的PHP项目进行测试，熟悉整个流程后再处理复杂项目。"
              type="info"
              style={{ marginTop: 16 }}
            />
          </Card>
        </TabPane>

        {/* 常见问题 */}
        <TabPane tab={<><QuestionCircleOutlined /> 常见问题</>} key="faq">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Search
              placeholder="搜索问题..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            
            <Collapse>
              {filteredFAQ.map((item, index) => (
                <Panel header={item.question} key={index}>
                  <Text>{item.answer}</Text>
                </Panel>
              ))}
            </Collapse>
          </Space>
        </TabPane>

        {/* 故障排除 */}
        <TabPane tab={<><BugOutlined /> 故障排除</>} key="troubleshooting">
          <Space direction="vertical" style={{ width: '100%' }}>
            {troubleshootingData.map((item, index) => (
              <Card key={index} size="small" title={item.title}>
                <List
                  size="small"
                  dataSource={item.content}
                  renderItem={(step) => (
                    <List.Item>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      {step}
                    </List.Item>
                  )}
                />
              </Card>
            ))}
            
            <Alert
              message="仍然遇到问题？"
              description={
                <div>
                  <Paragraph>如果以上方法无法解决您的问题，请：</Paragraph>
                  <ul>
                    <li>查看详细的错误日志</li>
                    <li>检查系统环境配置</li>
                    <li>联系技术支持获取帮助</li>
                  </ul>
                </div>
              }
              type="warning"
            />
          </Space>
        </TabPane>

        {/* 快捷键 */}
        <TabPane tab={<><SettingOutlined /> 快捷键</>} key="shortcuts">
          <Card title="键盘快捷键">
            <List
              dataSource={keyboardShortcuts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Tag color="blue">{item.key}</Tag>}
                    description={item.action}
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        {/* 文档 */}
        <TabPane tab={<><BookOutlined /> 文档</>} key="docs">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card title="项目管理">
              <Paragraph>
                <strong>导入项目：</strong>支持导入各种PHP项目，自动识别项目类型和配置。
              </Paragraph>
              <Paragraph>
                <strong>项目配置：</strong>可以自定义项目的各种参数，包括PHP版本、入口文件、环境变量等。
              </Paragraph>
              <Paragraph>
                <strong>项目监控：</strong>实时监控项目状态，包括服务器运行状态和性能指标。
              </Paragraph>
            </Card>

            <Card title="调试功能">
              <Paragraph>
                <strong>内置服务器：</strong>集成PHP内置服务器，支持实时预览和调试。
              </Paragraph>
              <Paragraph>
                <strong>日志监控：</strong>实时显示服务器日志，支持多级别过滤和搜索。
              </Paragraph>
              <Paragraph>
                <strong>性能监控：</strong>监控服务器性能指标，包括请求数量、错误率等。
              </Paragraph>
            </Card>

            <Card title="打包构建">
              <Paragraph>
                <strong>配置选项：</strong>丰富的打包配置选项，支持多平台和自定义设置。
              </Paragraph>
              <Paragraph>
                <strong>构建流程：</strong>可视化的构建流程，实时显示构建进度和状态。
              </Paragraph>
              <Paragraph>
                <strong>分发管理：</strong>自动生成各平台的安装包和可执行文件。
              </Paragraph>
            </Card>

            <Divider />
            
            <Alert
              message="更多文档"
              description={
                <div>
                  <Paragraph>完整的使用文档和API参考请访问：</Paragraph>
                  <Button type="link" href="#" target="_blank">
                    在线文档
                  </Button>
                  <Button type="link" href="#" target="_blank">
                    GitHub仓库
                  </Button>
                </div>
              }
              type="info"
            />
          </Space>
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default HelpSystem;
