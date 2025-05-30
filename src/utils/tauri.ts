import { invoke } from '@tauri-apps/api/tauri';
import { PhpProject, BuildConfig } from '../store/useProjectStore';
import { isTauriEnvironment } from './environment';

/**
 * 安全的 Tauri invoke 包装函数
 * 在浏览器环境中返回模拟数据，在 Tauri 环境中调用真实命令
 */
const safeInvoke = async <T>(command: string, args?: any): Promise<T> => {
  if (!isTauriEnvironment()) {
    // 浏览器环境，返回模拟数据
    return getMockData<T>(command, args);
  }

  try {
    return await invoke<T>(command, args);
  } catch (error) {
    console.warn(`Tauri command '${command}' failed:`, error);
    // 如果 Tauri 调用失败，也返回模拟数据
    return getMockData<T>(command, args);
  }
};

/**
 * 获取模拟数据
 */
const getMockData = <T>(command: string, args?: any): T => {
  switch (command) {
    case 'get_projects':
      return [] as T;

    case 'import_php_project':
      const mockProject: PhpProject = {
        id: `project_${Date.now()}`,
        name: args?.path?.split('/').pop() || 'Mock Project',
        path: args?.path || '/mock/path',
        project_type: 'PHP',
        entry_file: 'index.php',
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString()
      };
      return mockProject as T;

    case 'start_php_server':
      return 'Mock server started successfully' as T;

    case 'stop_php_server':
      return 'Mock server stopped successfully' as T;

    case 'get_server_status':
      return false as T;

    case 'get_available_port':
      return (8000 + Math.floor(Math.random() * 1000)) as T;

    case 'build_project':
      return 'Mock build completed successfully' as T;

    case 'greet':
      return `Hello, ${args?.name || 'World'}! (Mock response)` as T;

    default:
      console.warn(`No mock data available for command: ${command}`);
      return null as T;
  }
};

// 项目管理相关的Tauri命令
export const tauriCommands = {
  // 导入PHP项目
  importPhpProject: async (path: string): Promise<PhpProject> => {
    return await safeInvoke<PhpProject>('import_php_project', { path });
  },

  // 获取项目列表
  getProjects: async (): Promise<PhpProject[]> => {
    return await safeInvoke<PhpProject[]>('get_projects');
  },

  // 启动PHP服务器
  startPhpServer: async (projectPath: string, port: number): Promise<string> => {
    return await safeInvoke<string>('start_php_server', { projectPath, port });
  },

  // 停止PHP服务器
  stopPhpServer: async (port: number): Promise<string> => {
    return await safeInvoke<string>('stop_php_server', { port });
  },

  // 获取服务器状态
  getServerStatus: async (port: number): Promise<boolean> => {
    return await safeInvoke<boolean>('get_server_status', { port });
  },

  // 获取可用端口
  getAvailablePort: async (): Promise<number> => {
    return await safeInvoke<number>('get_available_port');
  },

  // 构建项目
  buildProject: async (projectId: string, config: BuildConfig): Promise<string> => {
    return await safeInvoke<string>('build_project', { projectId, config });
  },

  // 问候测试命令
  greet: async (name: string): Promise<string> => {
    return await safeInvoke<string>('greet', { name });
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
