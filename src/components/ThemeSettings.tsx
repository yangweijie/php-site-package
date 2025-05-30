import React from 'react';
import {
  Drawer,
  Card,
  Space,
  Radio,
  Switch,
  Slider,
  Button,
  Typography,
  Divider,
  Row,
  Col,
  Tag,
  Alert
} from 'antd';
import {
  BgColorsOutlined,
  FontSizeOutlined,
  BorderOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useThemeStore, ThemeMode, ColorScheme } from '../store/useThemeStore';

const { Title, Text } = Typography;

interface ThemeSettingsProps {
  visible: boolean;
  onClose: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ visible, onClose }) => {
  const {
    config,
    actualMode,
    setThemeMode,
    setColorScheme,
    setFontSize,
    setCompactMode,
    setBorderRadius,
    setAnimations,
    resetTheme
  } = useThemeStore();

  const colorSchemeOptions = [
    { value: 'blue', label: '蓝色', color: '#1890ff' },
    { value: 'green', label: '绿色', color: '#52c41a' },
    { value: 'purple', label: '紫色', color: '#722ed1' },
    { value: 'orange', label: '橙色', color: '#fa8c16' },
    { value: 'red', label: '红色', color: '#f5222d' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: '小', description: '12px' },
    { value: 'medium', label: '中', description: '14px' },
    { value: 'large', label: '大', description: '16px' }
  ];

  const borderRadiusOptions = [
    { value: 'none', label: '无圆角', description: '0px' },
    { value: 'small', label: '小圆角', description: '2px' },
    { value: 'medium', label: '中圆角', description: '6px' },
    { value: 'large', label: '大圆角', description: '12px' }
  ];

  return (
    <Drawer
      title={
        <Space>
          <BgColorsOutlined />
          主题设置
        </Space>
      }
      placement="right"
      width={400}
      open={visible}
      onClose={onClose}
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={resetTheme}
          size="small"
        >
          重置
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 主题模式 */}
        <Card size="small" title="主题模式">
          <Radio.Group
            value={config.mode}
            onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="light">
                <Space>
                  浅色主题
                  <Tag color="blue">推荐</Tag>
                </Space>
              </Radio>
              <Radio value="dark">
                <Space>
                  深色主题
                  <Tag color="purple">护眼</Tag>
                </Space>
              </Radio>
              <Radio value="auto">
                <Space>
                  跟随系统
                  <Tag color="green">智能</Tag>
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
          
          <Alert
            message={`当前模式: ${actualMode === 'light' ? '浅色' : '深色'}`}
            type="info"
            size="small"
            style={{ marginTop: 12 }}
          />
        </Card>

        {/* 颜色方案 */}
        <Card size="small" title="颜色方案">
          <Row gutter={[8, 8]}>
            {colorSchemeOptions.map((option) => (
              <Col span={12} key={option.value}>
                <Button
                  style={{
                    width: '100%',
                    height: 40,
                    borderColor: option.color,
                    color: config.colorScheme === option.value ? '#fff' : option.color,
                    backgroundColor: config.colorScheme === option.value ? option.color : 'transparent'
                  }}
                  onClick={() => setColorScheme(option.value as ColorScheme)}
                  icon={config.colorScheme === option.value ? <CheckOutlined /> : null}
                >
                  {option.label}
                </Button>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 字体大小 */}
        <Card size="small" title={<><FontSizeOutlined /> 字体大小</>}>
          <Radio.Group
            value={config.fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {fontSizeOptions.map((option) => (
                <Radio key={option.value} value={option.value}>
                  <Space>
                    {option.label}
                    <Text type="secondary">({option.description})</Text>
                  </Space>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Card>

        {/* 边框圆角 */}
        <Card size="small" title={<><BorderOutlined /> 边框圆角</>}>
          <Radio.Group
            value={config.borderRadius}
            onChange={(e) => setBorderRadius(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {borderRadiusOptions.map((option) => (
                <Radio key={option.value} value={option.value}>
                  <Space>
                    {option.label}
                    <Text type="secondary">({option.description})</Text>
                  </Space>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Card>

        {/* 界面选项 */}
        <Card size="small" title="界面选项">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <Text>紧凑模式</Text>
                <Text type="secondary">减少间距和组件大小</Text>
              </Space>
              <Switch
                checked={config.compactMode}
                onChange={setCompactMode}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <ThunderboltOutlined />
                <Text>动画效果</Text>
                <Text type="secondary">界面过渡动画</Text>
              </Space>
              <Switch
                checked={config.animations}
                onChange={setAnimations}
              />
            </div>
          </Space>
        </Card>

        {/* 预览区域 */}
        <Card size="small" title="预览效果">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ 
              padding: 16, 
              border: '1px solid #d9d9d9', 
              borderRadius: config.borderRadius === 'none' ? 0 : 
                           config.borderRadius === 'small' ? 2 :
                           config.borderRadius === 'medium' ? 6 : 12,
              backgroundColor: actualMode === 'dark' ? '#1f1f1f' : '#fafafa'
            }}>
              <Space>
                <Button type="primary" size={config.compactMode ? 'small' : 'middle'}>
                  主要按钮
                </Button>
                <Button size={config.compactMode ? 'small' : 'middle'}>
                  次要按钮
                </Button>
              </Space>
            </div>
            
            <Text 
              style={{ 
                fontSize: config.fontSize === 'small' ? 12 : 
                         config.fontSize === 'medium' ? 14 : 16 
              }}
            >
              这是预览文本，展示当前字体大小效果。
            </Text>
          </Space>
        </Card>

        <Divider />

        {/* 说明信息 */}
        <Alert
          message="主题设置说明"
          description="主题设置会自动保存，重启应用后仍然有效。建议根据使用环境和个人喜好进行调整。"
          type="info"
          showIcon
        />
      </Space>
    </Drawer>
  );
};

export default ThemeSettings;
