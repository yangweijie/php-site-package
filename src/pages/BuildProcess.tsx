import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Progress, 
  Steps, 
  Alert, 
  Space,
  List,
  Tag,
  Divider,
  message,
  Modal
} from 'antd';
import { 
  PlayCircleOutlined, 
  CheckCircleOutlined, 
  LoadingOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface BuildStep {
  title: string;
  description: string;
  status: 'wait' | 'process' | 'finish' | 'error';
  logs: string[];
}

interface BuildResult {
  platform: string;
  status: 'success' | 'failed';
  outputPath?: string;
  size?: string;
  error?: string;
}

const BuildProcess: React.FC = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([
    {
      title: '准备构建环境',
      description: '检查依赖和配置',
      status: 'wait',
      logs: []
    },
    {
      title: '复制项目文件',
      description: '复制PHP项目到构建目录',
      status: 'wait',
      logs: []
    },
    {
      title: '安装PHP运行时',
      description: '下载并配置PHP运行环境',
      status: 'wait',
      logs: []
    },
    {
      title: '处理依赖',
      description: '安装Composer依赖和PHP扩展',
      status: 'wait',
      logs: []
    },
    {
      title: '生成可执行文件',
      description: '创建各平台的可执行文件',
      status: 'wait',
      logs: []
    },
    {
      title: '打包完成',
      description: '生成最终的安装包',
      status: 'wait',
      logs: []
    }
  ]);
  const [buildResults, setBuildResults] = useState<BuildResult[]>([]);

  const handleStartBuild = async () => {
    setIsBuilding(true);
    setCurrentStep(0);
    setBuildProgress(0);
    setBuildResults([]);

    // 重置步骤状态
    const resetSteps = buildSteps.map(step => ({ ...step, status: 'wait' as const, logs: [] }));
    setBuildSteps(resetSteps);

    try {
      // 模拟构建过程
      for (let i = 0; i < buildSteps.length; i++) {
        setCurrentStep(i);
        
        // 更新当前步骤状态
        setBuildSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'process' } : step
        ));

        // 模拟构建时间
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 添加日志
        const logs = [
          `开始执行: ${buildSteps[i].title}`,
          `正在处理...`,
          `${buildSteps[i].title} 完成`
        ];

        setBuildSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'finish', logs } : step
        ));

        setBuildProgress((i + 1) / buildSteps.length * 100);
      }

      // 模拟构建结果
      const results: BuildResult[] = [
        {
          platform: 'Windows (x64)',
          status: 'success',
          outputPath: './dist/windows/MyApp-1.0.0-setup.exe',
          size: '45.2 MB'
        },
        {
          platform: 'macOS (Intel)',
          status: 'success',
          outputPath: './dist/macos/MyApp-1.0.0.dmg',
          size: '42.8 MB'
        }
      ];

      setBuildResults(results);
      message.success('构建完成！');

    } catch (error) {
      message.error('构建失败');
      console.error(error);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleOpenOutputDir = () => {
    // TODO: Open output directory with Tauri
    message.info('打开输出目录');
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'process':
        return <LoadingOutlined />;
      case 'finish':
        return <CheckCircleOutlined />;
      case 'error':
        return <ExclamationCircleOutlined />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>构建和分发</Title>
        <Space>
          <Button 
            type="primary" 
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleStartBuild}
            disabled={isBuilding}
            loading={isBuilding}
          >
            {isBuilding ? '构建中...' : '开始构建'}
          </Button>
          {buildResults.length > 0 && (
            <Button 
              icon={<FolderOpenOutlined />}
              onClick={handleOpenOutputDir}
            >
              打开输出目录
            </Button>
          )}
        </Space>
      </div>

      {isBuilding && (
        <Card style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Text strong>构建进度</Text>
            <Progress 
              percent={Math.round(buildProgress)} 
              status={isBuilding ? 'active' : 'success'}
              className="build-progress"
            />
          </div>
          
          <Steps current={currentStep} direction="vertical" size="small">
            {buildSteps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
                status={step.status}
                icon={getStepIcon(step.status)}
              />
            ))}
          </Steps>
        </Card>
      )}

      {buildResults.length > 0 && (
        <Card title="构建结果" style={{ marginBottom: 24 }}>
          <List
            dataSource={buildResults}
            renderItem={(result) => (
              <List.Item
                actions={[
                  result.status === 'success' && (
                    <Button 
                      type="link" 
                      icon={<DownloadOutlined />}
                      onClick={() => message.info('下载功能开发中')}
                    >
                      下载
                    </Button>
                  )
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      {result.platform}
                      <Tag color={result.status === 'success' ? 'green' : 'red'}>
                        {result.status === 'success' ? '成功' : '失败'}
                      </Tag>
                    </Space>
                  }
                  description={
                    result.status === 'success' ? (
                      <div>
                        <div>文件路径: <Text code>{result.outputPath}</Text></div>
                        <div>文件大小: {result.size}</div>
                      </div>
                    ) : (
                      <Text type="danger">{result.error}</Text>
                    )
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      <Card title="构建说明">
        <Alert
          message="构建前准备"
          description={
            <div>
              <Paragraph>
                在开始构建之前，请确保：
              </Paragraph>
              <ul>
                <li>已正确配置项目的打包参数</li>
                <li>项目代码没有语法错误</li>
                <li>所需的PHP扩展已在配置中选择</li>
                <li>有足够的磁盘空间用于构建输出</li>
              </ul>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Alert
          message="构建过程说明"
          description={
            <div>
              <Paragraph>
                构建过程包括以下步骤：
              </Paragraph>
              <ol>
                <li><strong>环境准备</strong>: 检查构建环境和依赖</li>
                <li><strong>文件复制</strong>: 将项目文件复制到构建目录</li>
                <li><strong>PHP运行时</strong>: 下载并配置对应版本的PHP</li>
                <li><strong>依赖处理</strong>: 安装Composer依赖和PHP扩展</li>
                <li><strong>生成可执行文件</strong>: 为每个目标平台创建可执行文件</li>
                <li><strong>打包</strong>: 生成最终的安装包或压缩文件</li>
              </ol>
            </div>
          }
          type="warning"
          showIcon
        />
      </Card>
    </div>
  );
};

export default BuildProcess;
