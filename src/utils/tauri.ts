import { invoke } from '@tauri-apps/api/tauri';
import { PhpProject, BuildConfig } from '../store/useProjectStore';

// 项目管理相关的Tauri命令
export const tauriCommands = {
  // 导入PHP项目
  importPhpProject: async (path: string): Promise<PhpProject> => {
    return await invoke('import_php_project', { path });
  },

  // 获取项目列表
  getProjects: async (): Promise<PhpProject[]> => {
    return await invoke('get_projects');
  },

  // 启动PHP服务器
  startPhpServer: async (projectPath: string, port: number): Promise<string> => {
    return await invoke('start_php_server', { projectPath, port });
  },

  // 停止PHP服务器
  stopPhpServer: async (port: number): Promise<string> => {
    return await invoke('stop_php_server', { port });
  },

  // 获取服务器状态
  getServerStatus: async (port: number): Promise<boolean> => {
    return await invoke('get_server_status', { port });
  },

  // 获取可用端口
  getAvailablePort: async (): Promise<number> => {
    return await invoke('get_available_port');
  },

  // 构建项目
  buildProject: async (projectId: string, config: BuildConfig): Promise<string> => {
    return await invoke('build_project', { projectId, config });
  },

  // 问候测试命令
  greet: async (name: string): Promise<string> => {
    return await invoke('greet', { name });
  }
};

// 项目类型检测
export const detectProjectType = (path: string): string => {
  // 这里可以根据文件结构检测项目类型
  // 实际实现应该在Rust后端进行
  return 'Unknown';
};

// 生成随机端口
export const generateRandomPort = (): number => {
  return 8000 + Math.floor(Math.random() * 1000);
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// 验证项目路径
export const validateProjectPath = (path: string): boolean => {
  // 基本的路径验证
  return path && path.length > 0 && !path.includes('..') && !path.includes('//');
};

// 获取项目类型颜色
export const getProjectTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'Laravel': 'red',
    'Symfony': 'blue',
    'CodeIgniter': 'green',
    'WordPress': 'purple',
    'Drupal': 'orange',
    'CakePHP': 'yellow',
    'Zend': 'cyan',
    'Unknown': 'default'
  };
  return colors[type] || 'default';
};

// 获取平台显示名称
export const getPlatformDisplayName = (platform: string): string => {
  const names: { [key: string]: string } = {
    'windows-x64': 'Windows (x64)',
    'macos-x64': 'macOS (Intel)',
    'macos-arm64': 'macOS (Apple Silicon)',
    'linux-x64': 'Linux (x64)'
  };
  return names[platform] || platform;
};
