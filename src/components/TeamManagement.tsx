import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Avatar,
  Typography,
  Popconfirm,
  Tabs,
  List,
  Badge,
  Tooltip,
  Transfer,
  Tree,
  Switch,
  Alert,
  Divider
} from 'antd';
import {
  UserAddOutlined,
  TeamOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  ProjectOutlined,
  BranchesOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
  permissions: string[];
  projects: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  isDefault: boolean;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  level: 'read' | 'write' | 'admin';
}

const TeamManagement: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      // 模拟加载团队数据
      const mockMembers: TeamMember[] = [
        {
          id: '1',
          name: '张三',
          email: 'zhangsan@example.com',
          role: 'owner',
          status: 'active',
          joinDate: '2024-01-15',
          lastActive: '2024-01-20',
          permissions: ['all'],
          projects: ['project1', 'project2', 'project3']
        },
        {
          id: '2',
          name: '李四',
          email: 'lisi@example.com',
          role: 'admin',
          status: 'active',
          joinDate: '2024-01-16',
          lastActive: '2024-01-19',
          permissions: ['project:manage', 'build:execute', 'team:view'],
          projects: ['project1', 'project2']
        },
        {
          id: '3',
          name: '王五',
          email: 'wangwu@example.com',
          role: 'developer',
          status: 'active',
          joinDate: '2024-01-18',
          lastActive: '2024-01-20',
          permissions: ['project:read', 'build:execute'],
          projects: ['project1']
        }
      ];

      const mockRoles: Role[] = [
        {
          id: 'owner',
          name: '所有者',
          description: '拥有所有权限，可以管理团队和项目',
          permissions: ['all'],
          color: 'red',
          isDefault: false
        },
        {
          id: 'admin',
          name: '管理员',
          description: '可以管理项目和团队成员',
          permissions: ['project:manage', 'build:execute', 'team:manage'],
          color: 'orange',
          isDefault: false
        },
        {
          id: 'developer',
          name: '开发者',
          description: '可以访问和构建项目',
          permissions: ['project:read', 'project:write', 'build:execute'],
          color: 'blue',
          isDefault: true
        },
        {
          id: 'viewer',
          name: '查看者',
          description: '只能查看项目信息',
          permissions: ['project:read'],
          color: 'green',
          isDefault: false
        }
      ];

      const mockPermissions: Permission[] = [
        { id: 'project:read', name: '查看项目', description: '可以查看项目信息和文件', category: '项目管理', level: 'read' },
        { id: 'project:write', name: '编辑项目', description: '可以修改项目配置和文件', category: '项目管理', level: 'write' },
        { id: 'project:manage', name: '管理项目', description: '可以创建、删除和管理项目', category: '项目管理', level: 'admin' },
        { id: 'build:execute', name: '执行构建', description: '可以启动和管理构建过程', category: '构建管理', level: 'write' },
        { id: 'build:config', name: '配置构建', description: '可以修改构建配置', category: '构建管理', level: 'write' },
        { id: 'team:view', name: '查看团队', description: '可以查看团队成员信息', category: '团队管理', level: 'read' },
        { id: 'team:manage', name: '管理团队', description: '可以添加、删除和管理团队成员', category: '团队管理', level: 'admin' },
        { id: 'plugin:install', name: '安装插件', description: '可以安装和卸载插件', category: '插件管理', level: 'write' },
        { id: 'plugin:config', name: '配置插件', description: '可以配置插件设置', category: '插件管理', level: 'write' }
      ];

      setMembers(mockMembers);
      setRoles(mockRoles);
      setPermissions(mockPermissions);
    } catch (error) {
      console.error('加载团队数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (values: any) => {
    try {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: values.name,
        email: values.email,
        role: values.role,
        status: 'pending',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: '',
        permissions: roles.find(r => r.id === values.role)?.permissions || [],
        projects: values.projects || []
      };

      setMembers(prev => [...prev, newMember]);
      setMemberModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('添加成员失败:', error);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const rolePermissions = roles.find(r => r.id === newRole)?.permissions || [];
      setMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, role: newRole as any, permissions: rolePermissions }
          : member
      ));
    } catch (error) {
      console.error('更新成员角色失败:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      setMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('移除成员失败:', error);
    }
  };

  const getRoleColor = (role: string) => {
    const roleInfo = roles.find(r => r.id === role);
    return roleInfo?.color || 'default';
  };

  const getRoleName = (role: string) => {
    const roleInfo = roles.find(r => r.id === role);
    return roleInfo?.name || role;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const memberColumns = [
    {
      title: '成员',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: TeamMember) => (
        <Space>
          <Avatar src={record.avatar} icon={<TeamOutlined />} />
          <div>
            <div>{name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)} icon={role === 'owner' ? <CrownOutlined /> : undefined}>
          {getRoleName(role)}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={status === 'active' ? '活跃' : status === 'inactive' ? '非活跃' : '待激活'} 
        />
      )
    },
    {
      title: '项目数量',
      dataIndex: 'projects',
      key: 'projects',
      render: (projects: string[]) => (
        <Badge count={projects.length} style={{ backgroundColor: '#52c41a' }} />
      )
    },
    {
      title: '加入时间',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: TeamMember) => (
        <Space>
          <Select
            value={record.role}
            onChange={(value) => handleUpdateMemberRole(record.id, value)}
            style={{ width: 100 }}
            size="small"
            disabled={record.role === 'owner'}
          >
            {roles.map(role => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
          
          <Tooltip title="编辑权限">
            <Button
              type="text"
              size="small"
              icon={<KeyOutlined />}
              onClick={() => {
                setSelectedMember(record);
                // 打开权限编辑模态框
              }}
            />
          </Tooltip>
          
          {record.role !== 'owner' && (
            <Popconfirm
              title="确定要移除这个成员吗？"
              onConfirm={() => handleRemoveMember(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  const permissionTree = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push({
      title: perm.name,
      key: perm.id,
      description: perm.description,
      level: perm.level
    });
    return acc;
  }, {} as Record<string, any[]>);

  const treeData = Object.keys(permissionTree).map(category => ({
    title: category,
    key: category,
    children: permissionTree[category]
  }));

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3}>团队管理</Title>
        <Space>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setMemberModalVisible(true)}
          >
            邀请成员
          </Button>
          <Button
            icon={<SettingOutlined />}
            onClick={() => setRoleModalVisible(true)}
          >
            角色管理
          </Button>
        </Space>
      </div>

      <Tabs defaultActiveKey="members">
        {/* 团队成员 */}
        <TabPane tab={<><TeamOutlined /> 团队成员 ({members.length})</>} key="members">
          <Table
            columns={memberColumns}
            dataSource={members}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </TabPane>

        {/* 角色权限 */}
        <TabPane tab={<><SafetyCertificateOutlined /> 角色权限</>} key="roles">
          <List
            dataSource={roles}
            renderItem={(role) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setSelectedRole(role);
                      setRoleModalVisible(true);
                    }}
                  >
                    编辑
                  </Button>,
                  !role.isDefault && (
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      删除
                    </Button>
                  )
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: role.color }}
                      icon={role.id === 'owner' ? <CrownOutlined /> : <SafetyCertificateOutlined />}
                    />
                  }
                  title={
                    <Space>
                      {role.name}
                      {role.isDefault && <Tag color="blue">默认</Tag>}
                    </Space>
                  }
                  description={
                    <div>
                      <div>{role.description}</div>
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">权限: </Text>
                        {role.permissions.includes('all') ? (
                          <Tag color="red">所有权限</Tag>
                        ) : (
                          role.permissions.map(perm => (
                            <Tag key={perm} size="small">
                              {permissions.find(p => p.id === perm)?.name || perm}
                            </Tag>
                          ))
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </TabPane>

        {/* 权限管理 */}
        <TabPane tab={<><KeyOutlined /> 权限管理</>} key="permissions">
          <Alert
            message="权限说明"
            description="系统采用基于角色的权限控制(RBAC)，每个角色包含一组权限，用户通过角色获得相应的操作权限。"
            type="info"
            style={{ marginBottom: 16 }}
            showIcon
          />
          
          <Tree
            treeData={treeData}
            defaultExpandAll
            showLine
            titleRender={(node) => (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{node.title}</span>
                {node.level && (
                  <Tag color={node.level === 'read' ? 'green' : node.level === 'write' ? 'blue' : 'red'}>
                    {node.level === 'read' ? '读取' : node.level === 'write' ? '写入' : '管理'}
                  </Tag>
                )}
              </div>
            )}
          />
        </TabPane>
      </Tabs>

      {/* 添加成员模态框 */}
      <Modal
        title="邀请团队成员"
        open={memberModalVisible}
        onCancel={() => {
          setMemberModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddMember}
        >
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="输入成员姓名" />
          </Form.Item>
          
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="输入邮箱地址" />
          </Form.Item>
          
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="选择角色">
              {roles.filter(role => role.id !== 'owner').map(role => (
                <Option key={role.id} value={role.id}>
                  <Space>
                    <Tag color={role.color}>{role.name}</Tag>
                    <Text type="secondary">{role.description}</Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            label="项目权限"
            name="projects"
          >
            <Select
              mode="multiple"
              placeholder="选择可访问的项目"
            >
              <Option value="project1">Laravel项目</Option>
              <Option value="project2">WordPress站点</Option>
              <Option value="project3">原生PHP项目</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamManagement;
