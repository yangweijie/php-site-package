import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Switch,
  Button,
  Select,
  Space,
  Badge,
  Typography,
  Input,
  Tooltip,
  Tag
} from 'antd';
import {
  ClearOutlined,
  DownloadOutlined,
  SearchOutlined,
  FilterOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  details?: any;
}

interface LogViewerProps {
  logs: LogEntry[];
  onClear: () => void;
  onExport: () => void;
  autoScroll?: boolean;
  onAutoScrollChange?: (enabled: boolean) => void;
}

const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  onClear,
  onExport,
  autoScroll = true,
  onAutoScrollChange
}) => {
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(logs);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused) {
      setFilteredLogs(logs);
    }
  }, [logs, isPaused]);

  useEffect(() => {
    // 应用过滤器
    let filtered = logs;

    // 级别过滤
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    // 文本搜索
    if (searchText) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchText.toLowerCase()) ||
        log.source.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, levelFilter, searchText]);

  useEffect(() => {
    // 自动滚动到底部
    if (autoScroll && logContainerRef.current && !isPaused) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll, isPaused]);

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return '#ff4d4f';
      case 'warning': return '#faad14';
      case 'info': return '#52c41a';
      case 'debug': return '#1890ff';
      default: return '#666';
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '📝';
    }
  };

  const getLevelCounts = () => {
    const counts = {
      all: logs.length,
      error: logs.filter(log => log.level === 'error').length,
      warning: logs.filter(log => log.level === 'warning').length,
      info: logs.filter(log => log.level === 'info').length,
      debug: logs.filter(log => log.level === 'debug').length,
    };
    return counts;
  };

  const counts = getLevelCounts();

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card
      title="日志查看器"
      size="small"
      extra={
        <Space>
          <Tooltip title={isPaused ? "恢复日志更新" : "暂停日志更新"}>
            <Button
              type="text"
              icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
              onClick={handlePauseToggle}
              style={{ color: isPaused ? '#52c41a' : '#faad14' }}
            />
          </Tooltip>
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={onExport}
            title="导出日志"
          />
          <Button
            type="text"
            icon={<ClearOutlined />}
            onClick={onClear}
            title="清空日志"
          />
        </Space>
      }
    >
      {/* 过滤器控制栏 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Space>
          <Text strong>级别过滤:</Text>
          <Select
            value={levelFilter}
            onChange={setLevelFilter}
            style={{ width: 120 }}
            size="small"
          >
            <Option value="all">
              全部 <Badge count={counts.all} size="small" />
            </Option>
            <Option value="error">
              错误 <Badge count={counts.error} size="small" />
            </Option>
            <Option value="warning">
              警告 <Badge count={counts.warning} size="small" />
            </Option>
            <Option value="info">
              信息 <Badge count={counts.info} size="small" />
            </Option>
            <Option value="debug">
              调试 <Badge count={counts.debug} size="small" />
            </Option>
          </Select>
        </Space>

        <Search
          placeholder="搜索日志内容..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          size="small"
          allowClear
        />

        <Space>
          <Text>自动滚动:</Text>
          <Switch
            checked={autoScroll}
            onChange={onAutoScrollChange}
            size="small"
          />
        </Space>

        {isPaused && (
          <Tag color="orange">
            <PauseCircleOutlined /> 已暂停更新
          </Tag>
        )}
      </div>

      {/* 日志内容区域 */}
      <div
        ref={logContainerRef}
        style={{
          height: 400,
          overflow: 'auto',
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          fontSize: '12px',
          padding: '12px',
          borderRadius: '4px',
          border: '1px solid #d9d9d9'
        }}
      >
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
            {searchText || levelFilter !== 'all' ? '没有匹配的日志' : '暂无日志输出'}
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              style={{
                marginBottom: 4,
                padding: '4px 0',
                borderBottom: '1px solid #333'
              }}
            >
              <span style={{ color: '#888' }}>
                [{formatTimestamp(log.timestamp)}]
              </span>
              <span style={{ marginLeft: 8 }}>
                {getLogIcon(log.level)}
              </span>
              <span
                style={{
                  color: getLogColor(log.level),
                  marginLeft: 4,
                  fontWeight: log.level === 'error' ? 'bold' : 'normal'
                }}
              >
                [{log.level.toUpperCase()}]
              </span>
              <span style={{ marginLeft: 8, color: '#61dafb' }}>
                [{log.source}]
              </span>
              <span style={{ marginLeft: 8 }}>
                {log.message}
              </span>
              {log.details && (
                <div style={{ marginLeft: 24, marginTop: 4, color: '#888' }}>
                  {JSON.stringify(log.details, null, 2)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 状态栏 */}
      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
        <span>
          显示 {filteredLogs.length} / {logs.length} 条日志
        </span>
        <span>
          {isPaused ? '已暂停' : '实时更新'}
        </span>
      </div>
    </Card>
  );
};

export default LogViewer;
