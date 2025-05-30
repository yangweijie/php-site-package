import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Button,
  Typography,
  Space,
  Select,
  Input,
  Tabs,
  Badge,
  Switch,
  message,
  Row,
  Col
} from 'antd';
import {
  PlayCircleOutlined,
  StopOutlined,
  ClearOutlined,
  ReloadOutlined,
  BugOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../store/useProjectStore';
import { tauriCommands } from '../utils/tauri';
import LogViewer from '../components/LogViewer';
import AIAssistant from '../components/AIAssistant';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  details?: any;
}

const DebugConsole: React.FC = () => {
  const { projects } = useProjectStore();
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [currentPort, setCurrentPort] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [serverStats, setServerStats] = useState({
    requests: 0,
    errors: 0,
    uptime: 0
  });

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleStartServer = async () => {
    try {
      if (!selectedProject) {
        message.warning('请先选择一个项目');
        return;
      }

      const port = await tauriCommands.getAvailablePort();
      const result = await tauriCommands.startPhpServer(selectedProject, port);

      setIsServerRunning(true);
      setCurrentPort(port);

      addLog('info', `PHP服务器已启动，端口: ${port}`, 'SERVER');
      addLog('info', `项目路径: ${selectedProject}`, 'SERVER');
      addLog('info', `访问地址: http://localhost:${port}`, 'SERVER');

      // 开始监控服务器状态
      startServerMonitoring();

      message.success('服务器启动成功');
    } catch (error) {
      addLog('error', `服务器启动失败: ${error}`, 'SERVER');
      message.error('服务器启动失败');
      console.error(error);
    }
  };

  const handleStopServer = async () => {
    try {
      if (currentPort) {
        // TODO: Call Tauri command to stop server
        setIsServerRunning(false);
        addLog('info', `PHP服务器已停止，端口: ${currentPort}`);
        setCurrentPort(null);
        message.success('服务器已停止');
      }
    } catch (error) {
      message.error('停止服务器失败');
      console.error(error);
    }
  };

  const addLog = (level: 'info' | 'warning' | 'error' | 'debug', message: string, source: string = 'SYSTEM', details?: any) => {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
      details
    };
    setLogs(prev => [...prev, newLog]);
  };

  const startServerMonitoring = () => {
    // 模拟服务器监控
    const interval = setInterval(() => {
      if (!isServerRunning) {
        clearInterval(interval);
        return;
      }

      // 模拟随机请求和状态
      const shouldAddRequest = Math.random() > 0.7;
      if (shouldAddRequest) {
        const methods = ['GET', 'POST', 'PUT', 'DELETE'];
        const paths = ['/', '/api/users', '/api/posts', '/admin', '/login'];
        const statuses = [200, 201, 404, 500];

        const method = methods[Math.floor(Math.random() * methods.length)];
        const path = paths[Math.floor(Math.random() * paths.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        setServerStats(prev => ({
          ...prev,
          requests: prev.requests + 1,
          errors: status >= 400 ? prev.errors + 1 : prev.errors,
          uptime: prev.uptime + 5
        }));

        const level = status >= 500 ? 'error' : status >= 400 ? 'warning' : 'info';
        addLog(level, `${method} ${path} - ${status}`, 'HTTP', { method, path, status });
      }
    }, 5000);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const openInBrowser = () => {
    if (currentPort) {
      // TODO: Open browser with Tauri shell plugin
      window.open(`http://localhost:${currentPort}`, '_blank');
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return '#ff4d4f';
      case 'warning': return '#faad14';
      default: return '#52c41a';
    }
  };

  const exportLogs = () => {
    const logText = logs.map(log =>
      `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `php-server-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>调试控制台</Title>
        <Space>
          <Badge status={isServerRunning ? 'processing' : 'default'} />
          <Text>{isServerRunning ? `服务器运行中 (端口: ${currentPort})` : '服务器未启动'}</Text>
        </Space>
      </div>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title="服务器控制" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Text strong>选择项目:</Text>
                <Select
                  style={{ width: 300 }}
                  placeholder="选择要调试的项目"
                  value={selectedProject}
                  onChange={setSelectedProject}
                >
                  {projects.map(project => (
                    <Option key={project.id} value={project.path}>
                      {project.name} ({project.project_type})
                    </Option>
                  ))}
                </Select>
              </div>

              <Space>
                {!isServerRunning ? (
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={handleStartServer}
                    disabled={!selectedProject}
                  >
                    启动服务器
                  </Button>
                ) : (
                  <Button
                    danger
                    icon={<StopOutlined />}
                    onClick={handleStopServer}
                  >
                    停止服务器
                  </Button>
                )}

                {isServerRunning && (
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={openInBrowser}
                  >
                    在浏览器中打开
                  </Button>
                )}
              </Space>
            </Space>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="服务器统计" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>请求总数:</Text>
                <Badge count={serverStats.requests} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>错误数量:</Text>
                <Badge count={serverStats.errors} status={serverStats.errors > 0 ? 'error' : 'default'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>运行时间:</Text>
                <Text>{Math.floor(serverStats.uptime / 60)}分{serverStats.uptime % 60}秒</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="logs">
        <TabPane tab={<><BugOutlined /> 日志监控</>} key="logs">
          <LogViewer
            logs={logs}
            onClear={clearLogs}
            onExport={exportLogs}
            autoScroll={autoScroll}
            onAutoScrollChange={setAutoScroll}
          />
        </TabPane>

        <TabPane tab={<><RobotOutlined /> AI助手</>} key="ai">
          <AIAssistant
            projectPath={selectedProject}
            onApplyFix={(analysisId) => {
              addLog('info', `AI自动修复已应用: ${analysisId}`, 'AI');
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DebugConsole;
