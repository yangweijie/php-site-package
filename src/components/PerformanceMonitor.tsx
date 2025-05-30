import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Space,
  Button,
  Alert,
  List,
  Tag,
  Tooltip,
  Switch,
  Select,
  Divider,
  Timeline
} from 'antd';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  MemoryOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  LineChartOutlined,
  OptimizationOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  buildTime: number;
  startupTime: number;
  responseTime: number;
}

interface PerformanceIssue {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  suggestion: string;
  autoFixAvailable: boolean;
}

interface OptimizationSuggestion {
  id: string;
  category: 'memory' | 'cpu' | 'disk' | 'network';
  title: string;
  description: string;
  expectedImprovement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  implemented: boolean;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    buildTime: 0,
    startupTime: 0,
    responseTime: 0
  });
  
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [monitoring, setMonitoring] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [timeRange, setTimeRange] = useState('1h');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (monitoring) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
    
    loadInitialData();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [monitoring]);

  const startMonitoring = () => {
    intervalRef.current = setInterval(() => {
      updateMetrics();
    }, 2000);
  };

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateMetrics = () => {
    // 模拟实时性能数据
    setMetrics({
      cpu: Math.random() * 100,
      memory: 60 + Math.random() * 30,
      disk: 45 + Math.random() * 20,
      network: Math.random() * 50,
      buildTime: 120 + Math.random() * 60,
      startupTime: 3 + Math.random() * 2,
      responseTime: 100 + Math.random() * 200
    });
  };

  const loadInitialData = () => {
    const mockIssues: PerformanceIssue[] = [
      {
        id: '1',
        type: 'warning',
        title: '内存使用率过高',
        description: '应用内存使用率超过80%，可能影响性能',
        impact: 'medium',
        suggestion: '考虑增加内存或优化内存使用',
        autoFixAvailable: false
      },
      {
        id: '2',
        type: 'error',
        title: '构建时间过长',
        description: '项目构建时间超过5分钟，影响开发效率',
        impact: 'high',
        suggestion: '启用增量构建和缓存优化',
        autoFixAvailable: true
      },
      {
        id: '3',
        type: 'info',
        title: '网络延迟较高',
        description: 'API响应时间平均超过300ms',
        impact: 'low',
        suggestion: '考虑使用CDN或优化网络配置',
        autoFixAvailable: false
      }
    ];

    const mockSuggestions: OptimizationSuggestion[] = [
      {
        id: '1',
        category: 'memory',
        title: '启用内存压缩',
        description: '启用内存压缩可以减少内存使用量',
        expectedImprovement: '减少20-30%内存使用',
        difficulty: 'easy',
        implemented: false
      },
      {
        id: '2',
        category: 'cpu',
        title: '优化构建并行度',
        description: '增加构建并行任务数量以提高CPU利用率',
        expectedImprovement: '构建速度提升40%',
        difficulty: 'medium',
        implemented: false
      },
      {
        id: '3',
        category: 'disk',
        title: '启用磁盘缓存',
        description: '启用智能磁盘缓存以减少I/O操作',
        expectedImprovement: '磁盘I/O减少50%',
        difficulty: 'easy',
        implemented: true
      },
      {
        id: '4',
        category: 'network',
        title: '启用请求压缩',
        description: '对网络请求启用gzip压缩',
        expectedImprovement: '网络传输减少60%',
        difficulty: 'easy',
        implemented: false
      }
    ];

    setIssues(mockIssues);
    setSuggestions(mockSuggestions);
  };

  const handleAutoFix = async (issueId: string) => {
    try {
      // 模拟自动修复
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIssues(prev => prev.filter(issue => issue.id !== issueId));
    } catch (error) {
      console.error('自动修复失败:', error);
    }
  };

  const handleImplementSuggestion = async (suggestionId: string) => {
    try {
      setSuggestions(prev => prev.map(suggestion =>
        suggestion.id === suggestionId
          ? { ...suggestion, implemented: true }
          : suggestion
      ));
    } catch (error) {
      console.error('实施建议失败:', error);
    }
  };

  const getMetricColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return '#52c41a';
    if (value < thresholds[1]) return '#faad14';
    return '#ff4d4f';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <WarningOutlined style={{ color: '#ff4d4f' }} />;
      case 'warning': return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'info': return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      default: return <CheckCircleOutlined />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'memory': return <MemoryOutlined />;
      case 'cpu': return <DashboardOutlined />;
      case 'disk': return <ThunderboltOutlined />;
      case 'network': return <LineChartOutlined />;
      default: return <OptimizationOutlined />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'default';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3}>性能监控</Title>
        <Space>
          <Switch
            checked={monitoring}
            onChange={setMonitoring}
            checkedChildren="监控中"
            unCheckedChildren="已暂停"
          />
          <Switch
            checked={autoOptimize}
            onChange={setAutoOptimize}
            checkedChildren="自动优化"
            unCheckedChildren="手动优化"
          />
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 100 }}
          >
            <Option value="1h">1小时</Option>
            <Option value="6h">6小时</Option>
            <Option value="24h">24小时</Option>
            <Option value="7d">7天</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadInitialData}
          >
            刷新
          </Button>
        </Space>
      </div>

      {/* 性能指标概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="CPU使用率"
              value={metrics.cpu}
              precision={1}
              suffix="%"
              valueStyle={{ color: getMetricColor(metrics.cpu, [50, 80]) }}
            />
            <Progress
              percent={metrics.cpu}
              strokeColor={getMetricColor(metrics.cpu, [50, 80])}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="内存使用率"
              value={metrics.memory}
              precision={1}
              suffix="%"
              valueStyle={{ color: getMetricColor(metrics.memory, [60, 85]) }}
            />
            <Progress
              percent={metrics.memory}
              strokeColor={getMetricColor(metrics.memory, [60, 85])}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="磁盘使用率"
              value={metrics.disk}
              precision={1}
              suffix="%"
              valueStyle={{ color: getMetricColor(metrics.disk, [70, 90]) }}
            />
            <Progress
              percent={metrics.disk}
              strokeColor={getMetricColor(metrics.disk, [70, 90])}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="网络使用率"
              value={metrics.network}
              precision={1}
              suffix="%"
              valueStyle={{ color: getMetricColor(metrics.network, [30, 70]) }}
            />
            <Progress
              percent={metrics.network}
              strokeColor={getMetricColor(metrics.network, [30, 70])}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 性能时间指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="构建时间"
              value={metrics.buildTime}
              precision={0}
              suffix="秒"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="启动时间"
              value={metrics.startupTime}
              precision={1}
              suffix="秒"
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="响应时间"
              value={metrics.responseTime}
              precision={0}
              suffix="ms"
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 性能问题 */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <WarningOutlined />
                性能问题 ({issues.length})
              </Space>
            }
          >
            <List
              dataSource={issues}
              renderItem={(issue) => (
                <List.Item
                  actions={[
                    issue.autoFixAvailable && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleAutoFix(issue.id)}
                      >
                        自动修复
                      </Button>
                    ),
                    <Button size="small">查看详情</Button>
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={getIssueIcon(issue.type)}
                    title={
                      <Space>
                        {issue.title}
                        <Tag color={issue.impact === 'high' ? 'red' : issue.impact === 'medium' ? 'orange' : 'blue'}>
                          {issue.impact === 'high' ? '高影响' : issue.impact === 'medium' ? '中影响' : '低影响'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>{issue.description}</div>
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">建议: {issue.suggestion}</Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 优化建议 */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <OptimizationOutlined />
                优化建议 ({suggestions.filter(s => !s.implemented).length})
              </Space>
            }
          >
            <List
              dataSource={suggestions}
              renderItem={(suggestion) => (
                <List.Item
                  actions={[
                    !suggestion.implemented ? (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleImplementSuggestion(suggestion.id)}
                      >
                        实施
                      </Button>
                    ) : (
                      <Tag color="green">已实施</Tag>
                    )
                  ]}
                >
                  <List.Item.Meta
                    avatar={getCategoryIcon(suggestion.category)}
                    title={
                      <Space>
                        {suggestion.title}
                        <Tag color={getDifficultyColor(suggestion.difficulty)}>
                          {suggestion.difficulty === 'easy' ? '简单' : 
                           suggestion.difficulty === 'medium' ? '中等' : '困难'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>{suggestion.description}</div>
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">预期改善: {suggestion.expectedImprovement}</Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PerformanceMonitor;
