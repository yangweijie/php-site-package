import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  List,
  Button,
  Space,
  Tag,
  Avatar,
  Typography,
  Input,
  Select,
  Switch,
  Modal,
  Form,
  Rate,
  Progress,
  Alert,
  Divider,
  Badge,
  Tooltip
} from 'antd';
import {
  AppstoreOutlined,
  DownloadOutlined,
  SettingOutlined,
  DeleteOutlined,
  SearchOutlined,
  StarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  BugOutlined,
  BuildOutlined,
  BgColorsOutlined,
  ApiOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { usePluginStore, Plugin } from '../store/usePluginStore';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

const PluginManager: React.FC = () => {
  const {
    plugins,
    installedPlugins,
    availablePlugins,
    loading,
    installing,
    loadPlugins,
    installPlugin,
    uninstallPlugin,
    enablePlugin,
    disablePlugin,
    updatePlugin,
    configurePlugin,
    searchPlugins
  } = usePluginStore();

  const [activeTab, setActiveTab] = useState('installed');
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    loadPlugins();
  }, []);

  useEffect(() => {
    filterPlugins();
  }, [searchText, categoryFilter, activeTab, installedPlugins, availablePlugins]);

  const filterPlugins = () => {
    let plugins = activeTab === 'installed' ? installedPlugins : availablePlugins;
    
    if (searchText) {
      plugins = plugins.filter(p => 
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      plugins = plugins.filter(p => p.category === categoryFilter);
    }
    
    setFilteredPlugins(plugins);
  };

  const handleInstall = async (pluginId: string) => {
    try {
      await installPlugin(pluginId);
    } catch (error) {
      console.error('安装插件失败:', error);
    }
  };

  const handleUninstall = async (pluginId: string) => {
    try {
      await uninstallPlugin(pluginId);
    } catch (error) {
      console.error('卸载插件失败:', error);
    }
  };

  const handleToggleEnable = async (plugin: Plugin) => {
    try {
      if (plugin.enabled) {
        await disablePlugin(plugin.id);
      } else {
        await enablePlugin(plugin.id);
      }
    } catch (error) {
      console.error('切换插件状态失败:', error);
    }
  };

  const handleConfigure = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setConfigModalVisible(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'build': return <BuildOutlined />;
      case 'debug': return <BugOutlined />;
      case 'ui': return <BgColorsOutlined />;
      case 'integration': return <ApiOutlined />;
      case 'utility': return <ToolOutlined />;
      default: return <AppstoreOutlined />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'build': return 'blue';
      case 'debug': return 'orange';
      case 'ui': return 'purple';
      case 'integration': return 'green';
      case 'utility': return 'cyan';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'installed': return 'green';
      case 'available': return 'blue';
      case 'updating': return 'orange';
      case 'disabled': return 'red';
      default: return 'default';
    }
  };

  const renderPluginCard = (plugin: Plugin) => (
    <List.Item key={plugin.id}>
      <Card
        size="small"
        style={{ width: '100%' }}
        actions={[
          activeTab === 'installed' ? (
            <Tooltip title={plugin.enabled ? '禁用插件' : '启用插件'}>
              <Switch
                checked={plugin.enabled}
                onChange={() => handleToggleEnable(plugin)}
                size="small"
              />
            </Tooltip>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<DownloadOutlined />}
              loading={installing === plugin.id}
              onClick={() => handleInstall(plugin.id)}
            >
              安装
            </Button>
          ),
          <Tooltip title="配置插件">
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => handleConfigure(plugin)}
            />
          </Tooltip>,
          activeTab === 'installed' && (
            <Tooltip title="卸载插件">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleUninstall(plugin.id)}
              />
            </Tooltip>
          )
        ].filter(Boolean)}
      >
        <Card.Meta
          avatar={
            <Badge
              status={plugin.enabled ? 'success' : 'default'}
              offset={[-5, 5]}
            >
              <Avatar
                icon={getCategoryIcon(plugin.category)}
                style={{ backgroundColor: getCategoryColor(plugin.category) }}
              />
            </Badge>
          }
          title={
            <Space>
              {plugin.name}
              <Tag color={getCategoryColor(plugin.category)}>
                {plugin.category}
              </Tag>
              <Tag color={getStatusColor(plugin.status)}>
                v{plugin.version}
              </Tag>
            </Space>
          }
          description={
            <div>
              <Paragraph ellipsis={{ rows: 2 }}>
                {plugin.description}
              </Paragraph>
              <div style={{ marginTop: 8 }}>
                <Space>
                  <Text type="secondary">
                    <UserOutlined /> {plugin.author}
                  </Text>
                  {plugin.installDate && (
                    <Text type="secondary">
                      安装于: {new Date(plugin.installDate).toLocaleDateString()}
                    </Text>
                  )}
                </Space>
              </div>
            </div>
          }
        />
      </Card>
    </List.Item>
  );

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>插件管理</Title>
        <Button
          icon={<SyncOutlined />}
          onClick={loadPlugins}
          loading={loading}
        >
          刷新
        </Button>
      </div>

      {/* 搜索和过滤 */}
      <Card style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Search
              placeholder="搜索插件..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 120 }}
            >
              <Option value="all">所有分类</Option>
              <Option value="build">构建工具</Option>
              <Option value="debug">调试工具</Option>
              <Option value="ui">界面扩展</Option>
              <Option value="integration">集成工具</Option>
              <Option value="utility">实用工具</Option>
            </Select>
          </Space>
          
          <Space>
            <Text type="secondary">
              已安装: {installedPlugins.length} | 可用: {availablePlugins.length}
            </Text>
          </Space>
        </Space>
      </Card>

      {/* 插件列表 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={
            <Badge count={installedPlugins.length} size="small">
              <span>已安装插件</span>
            </Badge>
          } 
          key="installed"
        >
          {installedPlugins.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: 40 }}>
                <AppstoreOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                <Title level={4} type="secondary">暂无已安装插件</Title>
                <Text type="secondary">前往插件市场安装您需要的插件</Text>
              </div>
            </Card>
          ) : (
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={filteredPlugins}
              renderItem={renderPluginCard}
            />
          )}
        </TabPane>

        <TabPane 
          tab={
            <Badge count={availablePlugins.length} size="small">
              <span>插件市场</span>
            </Badge>
          } 
          key="available"
        >
          <Alert
            message="插件市场"
            description="这里展示了所有可用的插件，您可以根据需要安装和配置。"
            type="info"
            style={{ marginBottom: 16 }}
            showIcon
          />
          
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={filteredPlugins}
            renderItem={renderPluginCard}
          />
        </TabPane>
      </Tabs>

      {/* 插件配置模态框 */}
      <Modal
        title={`配置插件 - ${selectedPlugin?.name}`}
        open={configModalVisible}
        onCancel={() => {
          setConfigModalVisible(false);
          setSelectedPlugin(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setConfigModalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary">
            保存配置
          </Button>
        ]}
        width={600}
      >
        {selectedPlugin && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>插件信息</Text>
                  <Divider type="vertical" />
                  <Text>{selectedPlugin.description}</Text>
                </div>
                <div>
                  <Text strong>版本:</Text> {selectedPlugin.version}
                  <Divider type="vertical" />
                  <Text strong>作者:</Text> {selectedPlugin.author}
                </div>
                {selectedPlugin.permissions && (
                  <div>
                    <Text strong>权限:</Text>
                    <div style={{ marginTop: 4 }}>
                      {selectedPlugin.permissions.map(perm => (
                        <Tag key={perm} size="small">{perm}</Tag>
                      ))}
                    </div>
                  </div>
                )}
              </Space>
            </Card>

            <Form layout="vertical">
              <Form.Item label="插件配置">
                <Input.TextArea
                  rows={6}
                  placeholder="JSON格式的插件配置..."
                  defaultValue={JSON.stringify(selectedPlugin.config || {}, null, 2)}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PluginManager;
