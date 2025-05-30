import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  List,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  Tree,
  Tabs,
  Timeline,
  Progress,
  Alert,
  Tooltip,
  Badge,
  Divider,
  Avatar
} from 'antd';
import {
  BranchesOutlined,
  GitlabOutlined,
  GithubOutlined,
  PullRequestOutlined,
  TagOutlined,
  HistoryOutlined,
  MergeOutlined,
  PlusOutlined,
  SyncOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  FileTextOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface GitRepository {
  id: string;
  name: string;
  url: string;
  provider: 'github' | 'gitlab' | 'bitbucket' | 'custom';
  branch: string;
  lastCommit: string;
  status: 'connected' | 'disconnected' | 'syncing';
}

interface GitCommit {
  id: string;
  hash: string;
  message: string;
  author: string;
  date: string;
  files: string[];
  branch: string;
}

interface GitBranch {
  name: string;
  isActive: boolean;
  lastCommit: string;
  ahead: number;
  behind: number;
}

interface PullRequest {
  id: string;
  title: string;
  description: string;
  author: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'merged' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface VersionControlProps {
  projectPath: string;
  onRepositoryChange?: (repo: GitRepository) => void;
}

const VersionControl: React.FC<VersionControlProps> = ({
  projectPath,
  onRepositoryChange
}) => {
  const [repository, setRepository] = useState<GitRepository | null>(null);
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [commitModalVisible, setCommitModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadGitData();
  }, [projectPath]);

  const loadGitData = async () => {
    setLoading(true);
    try {
      // 模拟加载Git数据
      const mockRepo: GitRepository = {
        id: '1',
        name: 'php-desktop-packager',
        url: 'https://github.com/user/php-desktop-packager.git',
        provider: 'github',
        branch: 'main',
        lastCommit: '2024-01-20T10:30:00Z',
        status: 'connected'
      };

      const mockCommits: GitCommit[] = [
        {
          id: '1',
          hash: 'a1b2c3d',
          message: '添加AI辅助功能',
          author: '张三',
          date: '2024-01-20T10:30:00Z',
          files: ['src/components/AIAssistant.tsx', 'src/store/useAIStore.ts'],
          branch: 'main'
        },
        {
          id: '2',
          hash: 'e4f5g6h',
          message: '完善插件系统',
          author: '李四',
          date: '2024-01-20T09:15:00Z',
          files: ['src/pages/PluginManager.tsx', 'src/store/usePluginStore.ts'],
          branch: 'main'
        },
        {
          id: '3',
          hash: 'i7j8k9l',
          message: '优化构建流程',
          author: '王五',
          date: '2024-01-19T16:45:00Z',
          files: ['src/pages/BuildProcess.tsx', 'src-tauri/src/main.rs'],
          branch: 'develop'
        }
      ];

      const mockBranches: GitBranch[] = [
        {
          name: 'main',
          isActive: true,
          lastCommit: 'a1b2c3d',
          ahead: 0,
          behind: 0
        },
        {
          name: 'develop',
          isActive: false,
          lastCommit: 'i7j8k9l',
          ahead: 2,
          behind: 1
        },
        {
          name: 'feature/ai-assistant',
          isActive: false,
          lastCommit: 'm1n2o3p',
          ahead: 5,
          behind: 0
        }
      ];

      const mockPullRequests: PullRequest[] = [
        {
          id: '1',
          title: '添加AI智能分析功能',
          description: '实现代码质量分析、性能优化建议等AI功能',
          author: '张三',
          sourceBranch: 'feature/ai-assistant',
          targetBranch: 'main',
          status: 'open',
          createdAt: '2024-01-19T14:00:00Z',
          updatedAt: '2024-01-20T09:30:00Z'
        },
        {
          id: '2',
          title: '优化构建性能',
          description: '改进构建流程，提高构建速度',
          author: '李四',
          sourceBranch: 'feature/build-optimization',
          targetBranch: 'develop',
          status: 'merged',
          createdAt: '2024-01-18T10:00:00Z',
          updatedAt: '2024-01-19T15:00:00Z'
        }
      ];

      setRepository(mockRepo);
      setCommits(mockCommits);
      setBranches(mockBranches);
      setPullRequests(mockPullRequests);
      onRepositoryChange?.(mockRepo);
    } catch (error) {
      console.error('加载Git数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectRepository = async (values: any) => {
    try {
      setLoading(true);
      // 模拟连接仓库
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRepo: GitRepository = {
        id: Date.now().toString(),
        name: values.name,
        url: values.url,
        provider: values.provider,
        branch: values.branch || 'main',
        lastCommit: new Date().toISOString(),
        status: 'connected'
      };
      
      setRepository(newRepo);
      setConnectModalVisible(false);
      form.resetFields();
      onRepositoryChange?.(newRepo);
    } catch (error) {
      console.error('连接仓库失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async (values: any) => {
    try {
      const newCommit: GitCommit = {
        id: Date.now().toString(),
        hash: Math.random().toString(36).substr(2, 7),
        message: values.message,
        author: '当前用户',
        date: new Date().toISOString(),
        files: values.files || [],
        branch: repository?.branch || 'main'
      };
      
      setCommits(prev => [newCommit, ...prev]);
      setCommitModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  const handleSwitchBranch = async (branchName: string) => {
    try {
      setBranches(prev => prev.map(branch => ({
        ...branch,
        isActive: branch.name === branchName
      })));
      
      if (repository) {
        setRepository({
          ...repository,
          branch: branchName
        });
      }
    } catch (error) {
      console.error('切换分支失败:', error);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github': return <GithubOutlined />;
      case 'gitlab': return <GitlabOutlined />;
      default: return <BranchesOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'green';
      case 'disconnected': return 'red';
      case 'syncing': return 'orange';
      default: return 'default';
    }
  };

  const getPRStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'blue';
      case 'merged': return 'green';
      case 'closed': return 'red';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card
      title={
        <Space>
          <BranchesOutlined />
          版本控制
          {repository && (
            <Badge
              status={getStatusColor(repository.status) as any}
              text={repository.status === 'connected' ? '已连接' : '未连接'}
            />
          )}
        </Space>
      }
      extra={
        <Space>
          {repository ? (
            <>
              <Button
                icon={<SyncOutlined />}
                onClick={loadGitData}
                loading={loading}
                size="small"
              >
                同步
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCommitModalVisible(true)}
                size="small"
              >
                提交
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setConnectModalVisible(true)}
            >
              连接仓库
            </Button>
          )}
        </Space>
      }
    >
      {repository ? (
        <Tabs defaultActiveKey="commits">
          {/* 提交历史 */}
          <TabPane tab={<><HistoryOutlined /> 提交历史</>} key="commits">
            <List
              dataSource={commits}
              renderItem={(commit) => (
                <List.Item
                  actions={[
                    <Tooltip title="查看详情">
                      <Button type="text" size="small" icon={<FileTextOutlined />} />
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <Space>
                        <Text strong>{commit.message}</Text>
                        <Tag color="blue">{commit.hash}</Tag>
                        <Tag color="green">{commit.branch}</Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div>
                          <Text type="secondary">{commit.author}</Text>
                          <Divider type="vertical" />
                          <Text type="secondary">{formatDate(commit.date)}</Text>
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">
                            修改了 {commit.files.length} 个文件
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>

          {/* 分支管理 */}
          <TabPane tab={<><BranchesOutlined /> 分支管理</>} key="branches">
            <List
              dataSource={branches}
              renderItem={(branch) => (
                <List.Item
                  actions={[
                    !branch.isActive && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleSwitchBranch(branch.name)}
                      >
                        切换
                      </Button>
                    ),
                    <Button type="text" size="small">
                      删除
                    </Button>
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {branch.name}
                        {branch.isActive && <Tag color="green">当前分支</Tag>}
                        {branch.ahead > 0 && (
                          <Tag color="blue">领先 {branch.ahead}</Tag>
                        )}
                        {branch.behind > 0 && (
                          <Tag color="orange">落后 {branch.behind}</Tag>
                        )}
                      </Space>
                    }
                    description={
                      <Text type="secondary">
                        最后提交: {branch.lastCommit}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>

          {/* Pull Requests */}
          <TabPane tab={<><PullRequestOutlined /> Pull Requests</>} key="prs">
            <List
              dataSource={pullRequests}
              renderItem={(pr) => (
                <List.Item
                  actions={[
                    pr.status === 'open' && (
                      <Button type="primary" size="small">
                        合并
                      </Button>
                    ),
                    <Button type="text" size="small">
                      查看
                    </Button>
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {pr.title}
                        <Tag color={getPRStatusColor(pr.status)}>
                          {pr.status === 'open' ? '开放' : 
                           pr.status === 'merged' ? '已合并' : '已关闭'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Paragraph ellipsis={{ rows: 1 }}>
                          {pr.description}
                        </Paragraph>
                        <div>
                          <Text type="secondary">{pr.author}</Text>
                          <Divider type="vertical" />
                          <Text type="secondary">
                            {pr.sourceBranch} → {pr.targetBranch}
                          </Text>
                          <Divider type="vertical" />
                          <Text type="secondary">
                            {formatDate(pr.createdAt)}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>

          {/* 仓库信息 */}
          <TabPane tab={<><GitlabOutlined /> 仓库信息</>} key="info">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card size="small" title="仓库详情">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>仓库名称:</Text>
                  <Text>{repository.name}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>远程地址:</Text>
                  <Text copyable>{repository.url}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>当前分支:</Text>
                  <Tag color="green">{repository.branch}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>提供商:</Text>
                  <Space>
                    {getProviderIcon(repository.provider)}
                    <Text>{repository.provider}</Text>
                  </Space>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>最后同步:</Text>
                  <Text>{formatDate(repository.lastCommit)}</Text>
                </div>
              </Card>

              <Card size="small" title="快速操作">
                <Space wrap>
                  <Button icon={<CloudDownloadOutlined />}>拉取</Button>
                  <Button icon={<CloudUploadOutlined />}>推送</Button>
                  <Button icon={<MergeOutlined />}>合并</Button>
                  <Button icon={<TagOutlined />}>创建标签</Button>
                </Space>
              </Card>
            </Space>
          </TabPane>
        </Tabs>
      ) : (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <BranchesOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
          <Title level={4} type="secondary">未连接版本控制</Title>
          <Paragraph type="secondary">
            连接Git仓库以启用版本控制功能，包括提交历史、分支管理和协作功能。
          </Paragraph>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setConnectModalVisible(true)}
          >
            连接Git仓库
          </Button>
        </div>
      )}

      {/* 连接仓库模态框 */}
      <Modal
        title="连接Git仓库"
        open={connectModalVisible}
        onCancel={() => {
          setConnectModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleConnectRepository}
        >
          <Form.Item
            label="仓库名称"
            name="name"
            rules={[{ required: true, message: '请输入仓库名称' }]}
          >
            <Input placeholder="输入仓库名称" />
          </Form.Item>
          
          <Form.Item
            label="仓库地址"
            name="url"
            rules={[{ required: true, message: '请输入仓库地址' }]}
          >
            <Input placeholder="https://github.com/user/repo.git" />
          </Form.Item>
          
          <Form.Item
            label="提供商"
            name="provider"
            rules={[{ required: true, message: '请选择提供商' }]}
          >
            <Select placeholder="选择Git提供商">
              <Option value="github">
                <Space>
                  <GithubOutlined />
                  GitHub
                </Space>
              </Option>
              <Option value="gitlab">
                <Space>
                  <GitlabOutlined />
                  GitLab
                </Space>
              </Option>
              <Option value="custom">自定义</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="默认分支"
            name="branch"
          >
            <Input placeholder="main" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 提交模态框 */}
      <Modal
        title="提交更改"
        open={commitModalVisible}
        onCancel={() => {
          setCommitModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCommit}
        >
          <Form.Item
            label="提交信息"
            name="message"
            rules={[{ required: true, message: '请输入提交信息' }]}
          >
            <TextArea
              rows={3}
              placeholder="描述本次提交的更改..."
            />
          </Form.Item>
          
          <Form.Item
            label="修改的文件"
            name="files"
          >
            <Select
              mode="multiple"
              placeholder="选择要提交的文件"
            >
              <Option value="src/components/AIAssistant.tsx">AIAssistant.tsx</Option>
              <Option value="src/store/usePluginStore.ts">usePluginStore.ts</Option>
              <Option value="src/pages/PluginManager.tsx">PluginManager.tsx</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default VersionControl;
