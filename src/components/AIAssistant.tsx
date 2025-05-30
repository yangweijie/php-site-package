import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  List,
  Tag,
  Progress,
  Alert,
  Tabs,
  Input,
  Select,
  Switch,
  Tooltip,
  Badge,
  Avatar,
  Divider,
  Modal,
  Rate
} from 'antd';
import {
  RobotOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  SecurityScanOutlined,
  BarChartOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SendOutlined,
  HistoryOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface AIAnalysis {
  id: string;
  type: 'security' | 'performance' | 'quality' | 'optimization';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestion: string;
  autoFixAvailable: boolean;
  confidence: number;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

interface AIAssistantProps {
  projectPath?: string;
  onApplyFix?: (analysisId: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  projectPath,
  onApplyFix
}) => {
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    if (projectPath) {
      runAnalysis();
    }
  }, [projectPath]);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // 模拟AI分析过程
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockAnalyses: AIAnalysis[] = [
        {
          id: '1',
          type: 'security',
          title: '发现潜在的SQL注入风险',
          description: '在 UserController.php 第45行发现未经过滤的用户输入直接用于SQL查询',
          severity: 'high',
          suggestion: '使用参数化查询或ORM来防止SQL注入攻击',
          autoFixAvailable: true,
          confidence: 0.92,
          impact: '可能导致数据库被恶意访问',
          effort: 'low'
        },
        {
          id: '2',
          type: 'performance',
          title: '数据库查询性能问题',
          description: '检测到N+1查询问题，可能影响应用性能',
          severity: 'medium',
          suggestion: '使用Eager Loading优化数据库查询',
          autoFixAvailable: true,
          confidence: 0.87,
          impact: '页面加载时间可能增加2-5秒',
          effort: 'medium'
        },
        {
          id: '3',
          type: 'quality',
          title: '代码复杂度过高',
          description: 'OrderService.php 中的 processOrder 方法复杂度过高',
          severity: 'medium',
          suggestion: '将复杂方法拆分为多个小方法，提高代码可读性',
          autoFixAvailable: false,
          confidence: 0.78,
          impact: '代码维护难度增加',
          effort: 'high'
        },
        {
          id: '4',
          type: 'optimization',
          title: '未使用的依赖包',
          description: '发现3个未使用的Composer依赖包',
          severity: 'low',
          suggestion: '移除未使用的依赖包以减少应用体积',
          autoFixAvailable: true,
          confidence: 0.95,
          impact: '减少应用体积约2.3MB',
          effort: 'low'
        }
      ];
      
      setAnalyses(mockAnalyses);
    } catch (error) {
      console.error('AI分析失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFix = async (analysisId: string) => {
    try {
      // 模拟应用修复
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyses(prev => prev.map(analysis => 
        analysis.id === analysisId 
          ? { ...analysis, severity: 'low' as const, title: analysis.title + ' (已修复)' }
          : analysis
      ));
      
      onApplyFix?.(analysisId);
    } catch (error) {
      console.error('应用修复失败:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    // 模拟AI回复
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(chatInput),
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const getAIResponse = (input: string) => {
    const responses = [
      '根据您的项目分析，我建议优先处理安全相关的问题。',
      '这个问题可以通过重构代码来解决，我可以为您生成具体的修复方案。',
      '您的项目整体质量不错，只需要进行一些小的优化即可。',
      '建议您先备份代码，然后按照我的建议逐步进行优化。'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <SecurityScanOutlined />;
      case 'performance': return <BarChartOutlined />;
      case 'quality': return <BulbOutlined />;
      case 'optimization': return <ThunderboltOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const severityCounts = analyses.reduce((acc, analysis) => {
    acc[analysis.severity] = (acc[analysis.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card
      title={
        <Space>
          <RobotOutlined />
          AI智能助手
          {loading && <Badge status="processing" text="分析中..." />}
        </Space>
      }
      extra={
        <Button
          icon={<ThunderboltOutlined />}
          onClick={runAnalysis}
          loading={loading}
        >
          重新分析
        </Button>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* 智能分析 */}
        <TabPane tab={<><BulbOutlined /> 智能分析</>} key="analysis">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Progress type="circle" percent={75} />
              <div style={{ marginTop: 16 }}>
                <Text>AI正在分析您的项目...</Text>
              </div>
            </div>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* 分析概览 */}
              <Card size="small" title="分析概览">
                <Space>
                  <Tag color="red">严重: {severityCounts.critical || 0}</Tag>
                  <Tag color="orange">高: {severityCounts.high || 0}</Tag>
                  <Tag color="yellow">中: {severityCounts.medium || 0}</Tag>
                  <Tag color="green">低: {severityCounts.low || 0}</Tag>
                </Space>
              </Card>

              {/* 分析结果 */}
              <List
                dataSource={analyses}
                renderItem={(analysis) => (
                  <List.Item
                    actions={[
                      analysis.autoFixAvailable && (
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleApplyFix(analysis.id)}
                        >
                          自动修复
                        </Button>
                      ),
                      <Button size="small">查看详情</Button>
                    ].filter(Boolean)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={getTypeIcon(analysis.type)}
                          style={{ backgroundColor: getSeverityColor(analysis.severity) }}
                        />
                      }
                      title={
                        <Space>
                          {analysis.title}
                          <Tag color={getSeverityColor(analysis.severity)}>
                            {analysis.severity}
                          </Tag>
                          {analysis.autoFixAvailable && (
                            <Tag color="blue">可自动修复</Tag>
                          )}
                        </Space>
                      }
                      description={
                        <div>
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {analysis.description}
                          </Paragraph>
                          <div style={{ marginTop: 8 }}>
                            <Space>
                              <Text type="secondary">
                                置信度: <Rate disabled value={Math.round(analysis.confidence * 5)} />
                              </Text>
                              <Text type="secondary">
                                修复难度: {analysis.effort}
                              </Text>
                            </Space>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Space>
          )}
        </TabPane>

        {/* AI对话 */}
        <TabPane tab={<><RobotOutlined /> AI对话</>} key="chat">
          <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflow: 'auto', marginBottom: 16 }}>
              {chatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <RobotOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                  <Text type="secondary">向AI助手提问关于您项目的任何问题</Text>
                </div>
              ) : (
                <List
                  dataSource={chatMessages}
                  renderItem={(message) => (
                    <List.Item style={{ border: 'none', padding: '8px 0' }}>
                      <div style={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                      }}>
                        <div style={{
                          maxWidth: '70%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: message.type === 'user' ? '#1890ff' : '#f0f0f0',
                          color: message.type === 'user' ? 'white' : 'black'
                        }}>
                          <div>{message.content}</div>
                          <div style={{ 
                            fontSize: '12px', 
                            opacity: 0.7, 
                            marginTop: 4 
                          }}>
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <TextArea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="向AI助手提问..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
              >
                发送
              </Button>
            </div>
          </div>
        </TabPane>

        {/* 优化建议 */}
        <TabPane tab={<><ThunderboltOutlined /> 优化建议</>} key="suggestions">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message="智能优化建议"
              description="基于AI分析为您的项目提供个性化的优化建议"
              type="info"
              showIcon
            />

            <List
              dataSource={[
                {
                  title: '启用PHP OPcache',
                  description: '可以显著提高PHP应用性能，建议在生产环境中启用',
                  impact: '性能提升20-30%',
                  difficulty: '简单'
                },
                {
                  title: '优化数据库索引',
                  description: '为常用查询字段添加索引，提高数据库查询效率',
                  impact: '查询速度提升50%',
                  difficulty: '中等'
                },
                {
                  title: '使用CDN加速',
                  description: '将静态资源部署到CDN，提高全球访问速度',
                  impact: '加载速度提升40%',
                  difficulty: '中等'
                }
              ]}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="primary" size="small">应用建议</Button>,
                    <Button size="small">了解更多</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<BulbOutlined />} />}
                    title={item.title}
                    description={
                      <div>
                        <div>{item.description}</div>
                        <div style={{ marginTop: 8 }}>
                          <Tag color="green">影响: {item.impact}</Tag>
                          <Tag color="blue">难度: {item.difficulty}</Tag>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Space>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default AIAssistant;
