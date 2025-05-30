import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Avatar,
  Badge,
  Typography,
  Space,
  Button,
  Input,
  List,
  Tag,
  Tooltip,
  Popover,
  Timeline,
  Alert,
  Divider,
  Switch,
  Select,
  Modal
} from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  EyeOutlined,
  EditOutlined,
  ShareAltOutlined,
  BellOutlined,
  HistoryOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  PhoneOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  currentPage: string;
  lastSeen: string;
  isTyping?: boolean;
}

interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  details?: any;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
  resolved?: boolean;
}

interface RealTimeCollaborationProps {
  projectId: string;
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({
  projectId,
  currentUser
}) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showActivities, setShowActivities] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 模拟WebSocket连接
    connectWebSocket();
    loadInitialData();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [projectId]);

  const connectWebSocket = () => {
    // 模拟WebSocket连接
    // wsRef.current = new WebSocket('ws://localhost:8080/collaboration');
    
    // 模拟实时数据更新
    const interval = setInterval(() => {
      updateOnlineUsers();
      addRandomActivity();
    }, 5000);

    return () => clearInterval(interval);
  };

  const loadInitialData = () => {
    // 模拟加载初始数据
    const mockUsers: OnlineUser[] = [
      {
        id: '1',
        name: '张三',
        status: 'online',
        currentPage: '项目配置',
        lastSeen: new Date().toISOString()
      },
      {
        id: '2',
        name: '李四',
        status: 'away',
        currentPage: '调试控制台',
        lastSeen: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: '3',
        name: '王五',
        status: 'busy',
        currentPage: '构建分发',
        lastSeen: new Date(Date.now() - 600000).toISOString(),
        isTyping: true
      }
    ];

    const mockActivities: Activity[] = [
      {
        id: '1',
        userId: '1',
        userName: '张三',
        action: '修改了项目配置',
        target: 'Laravel项目',
        timestamp: new Date(Date.now() - 120000).toISOString()
      },
      {
        id: '2',
        userId: '2',
        userName: '李四',
        action: '启动了调试服务器',
        target: 'WordPress站点',
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: '3',
        userId: '3',
        userName: '王五',
        action: '开始构建项目',
        target: '原生PHP项目',
        timestamp: new Date(Date.now() - 600000).toISOString()
      }
    ];

    const mockComments: Comment[] = [
      {
        id: '1',
        userId: '1',
        userName: '张三',
        content: '这个配置需要调整一下PHP版本',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        resolved: false
      },
      {
        id: '2',
        userId: '2',
        userName: '李四',
        content: '构建过程中遇到了依赖问题，需要更新composer.json',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        resolved: true
      }
    ];

    setOnlineUsers(mockUsers);
    setActivities(mockActivities);
    setComments(mockComments);
  };

  const updateOnlineUsers = () => {
    setOnlineUsers(prev => prev.map(user => ({
      ...user,
      lastSeen: Math.random() > 0.7 ? new Date().toISOString() : user.lastSeen,
      isTyping: Math.random() > 0.8
    })));
  };

  const addRandomActivity = () => {
    const actions = [
      '查看了项目文件',
      '修改了配置',
      '运行了测试',
      '更新了依赖',
      '提交了更改'
    ];
    
    const targets = ['Laravel项目', 'WordPress站点', '原生PHP项目'];
    const users = ['张三', '李四', '王五'];
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      userId: Math.floor(Math.random() * 3 + 1).toString(),
      userName: users[Math.floor(Math.random() * users.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      timestamp: new Date().toISOString()
    };

    setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      content: newComment,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleResolveComment = (commentId: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? { ...comment, resolved: !comment.resolved }
        : comment
    ));
  };

  const generateShareLink = () => {
    const link = `${window.location.origin}/shared/${projectId}?token=${Date.now()}`;
    setShareLink(link);
    setShareModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'green';
      case 'away': return 'orange';
      case 'busy': return 'red';
      case 'offline': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return '在线';
      case 'away': return '离开';
      case 'busy': return '忙碌';
      case 'offline': return '离线';
      default: return '未知';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return time.toLocaleDateString();
  };

  return (
    <div style={{ display: 'flex', gap: 16, height: '100%' }}>
      {/* 在线用户面板 */}
      <Card
        title={
          <Space>
            <TeamOutlined />
            在线用户 ({onlineUsers.filter(u => u.status === 'online').length})
          </Space>
        }
        style={{ width: 300, height: 'fit-content' }}
        size="small"
        extra={
          <Space>
            <Tooltip title="视频通话">
              <Button
                type="text"
                size="small"
                icon={<VideoCameraOutlined />}
              />
            </Tooltip>
            <Tooltip title="语音通话">
              <Button
                type="text"
                size="small"
                icon={<PhoneOutlined />}
              />
            </Tooltip>
          </Space>
        }
      >
        <List
          dataSource={onlineUsers}
          renderItem={(user) => (
            <List.Item style={{ padding: '8px 0' }}>
              <List.Item.Meta
                avatar={
                  <Badge
                    status={getStatusColor(user.status) as any}
                    offset={[-5, 5]}
                  >
                    <Avatar src={user.avatar} icon={<UserOutlined />} />
                  </Badge>
                }
                title={
                  <Space>
                    {user.name}
                    {user.isTyping && (
                      <Tag color="blue" size="small">正在输入...</Tag>
                    )}
                  </Space>
                }
                description={
                  <div>
                    <div style={{ fontSize: '12px' }}>
                      {getStatusText(user.status)} · {user.currentPage}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999' }}>
                      {formatTime(user.lastSeen)}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 主要协作区域 */}
      <div style={{ flex: 1 }}>
        {/* 协作工具栏 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Switch
                checked={showActivities}
                onChange={setShowActivities}
                size="small"
              />
              <Text>显示活动</Text>
              
              <Switch
                checked={notifications}
                onChange={setNotifications}
                size="small"
              />
              <Text>通知</Text>
            </Space>
            
            <Space>
              <Button
                icon={<ShareAltOutlined />}
                onClick={generateShareLink}
                size="small"
              >
                分享项目
              </Button>
              <Button
                icon={<MessageOutlined />}
                size="small"
              >
                团队聊天
              </Button>
            </Space>
          </Space>
        </Card>

        <div style={{ display: 'flex', gap: 16 }}>
          {/* 实时活动 */}
          {showActivities && (
            <Card
              title={
                <Space>
                  <HistoryOutlined />
                  实时活动
                </Space>
              }
              style={{ flex: 1 }}
              size="small"
            >
              <Timeline
                items={activities.slice(0, 5).map(activity => ({
                  children: (
                    <div>
                      <Text strong>{activity.userName}</Text>
                      <Text> {activity.action} </Text>
                      <Text type="secondary">{activity.target}</Text>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        {formatTime(activity.timestamp)}
                      </div>
                    </div>
                  )
                }))}
              />
            </Card>
          )}

          {/* 评论和讨论 */}
          <Card
            title={
              <Space>
                <MessageOutlined />
                评论讨论 ({comments.length})
              </Space>
            }
            style={{ flex: 1 }}
            size="small"
          >
            <div style={{ marginBottom: 16 }}>
              <TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="添加评论或提问..."
                rows={2}
                style={{ marginBottom: 8 }}
              />
              <Button
                type="primary"
                size="small"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                发表评论
              </Button>
            </div>

            <List
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      size="small"
                      onClick={() => handleResolveComment(comment.id)}
                    >
                      {comment.resolved ? '重新打开' : '标记解决'}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <Space>
                        {comment.userName}
                        {comment.resolved && (
                          <Tag color="green" size="small">已解决</Tag>
                        )}
                      </Space>
                    }
                    description={
                      <div>
                        <Paragraph style={{ marginBottom: 4 }}>
                          {comment.content}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {formatTime(comment.timestamp)}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>

      {/* 分享模态框 */}
      <Modal
        title="分享项目"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setShareModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="copy"
            type="primary"
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
              // message.success('链接已复制到剪贴板');
            }}
          >
            复制链接
          </Button>
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="项目分享"
            description="通过此链接，其他人可以查看项目的实时状态和协作信息。"
            type="info"
            showIcon
          />
          
          <div>
            <Text strong>分享链接:</Text>
            <Input
              value={shareLink}
              readOnly
              style={{ marginTop: 8 }}
            />
          </div>
          
          <div>
            <Text strong>权限设置:</Text>
            <Select
              defaultValue="view"
              style={{ width: '100%', marginTop: 8 }}
            >
              <Option value="view">仅查看</Option>
              <Option value="comment">查看和评论</Option>
              <Option value="edit">编辑权限</Option>
            </Select>
          </div>
          
          <div>
            <Text strong>有效期:</Text>
            <Select
              defaultValue="7d"
              style={{ width: '100%', marginTop: 8 }}
            >
              <Option value="1d">1天</Option>
              <Option value="7d">7天</Option>
              <Option value="30d">30天</Option>
              <Option value="never">永不过期</Option>
            </Select>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default RealTimeCollaboration;
