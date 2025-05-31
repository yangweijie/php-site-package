import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: 'build' | 'debug' | 'ui' | 'integration' | 'utility';
  status: 'installed' | 'available' | 'updating' | 'disabled';
  enabled: boolean;
  config?: Record<string, any>;
  dependencies?: string[];
  permissions?: string[];
  downloadUrl?: string;
  homepage?: string;
  repository?: string;
  installDate?: string;
  lastUpdate?: string;
}

export interface PluginAPI {
  // 生命周期钩子
  onProjectImport?: (project: any) => Promise<any>;
  onProjectBuild?: (project: any, config: any) => Promise<any>;
  onServerStart?: (project: any, port: number) => Promise<void>;
  onServerStop?: (project: any, port: number) => Promise<void>;

  // UI扩展
  renderProjectActions?: (project: any) => React.ReactNode;
  renderBuildOptions?: (config: any) => React.ReactNode;
  renderDebugPanel?: (project: any) => React.ReactNode;

  // 工具函数
  addMenuItem?: (menu: any) => void;
  addCommand?: (command: any) => void;
  showNotification?: (message: string, type: string) => void;
}

interface PluginStore {
  // 插件列表
  plugins: Plugin[];
  installedPlugins: Plugin[];
  availablePlugins: Plugin[];

  // 插件状态
  loading: boolean;
  installing: string | null;

  // 插件操作
  loadPlugins: () => Promise<void>;
  installPlugin: (pluginId: string) => Promise<void>;
  uninstallPlugin: (pluginId: string) => Promise<void>;
  enablePlugin: (pluginId: string) => Promise<void>;
  disablePlugin: (pluginId: string) => Promise<void>;
  updatePlugin: (pluginId: string) => Promise<void>;
  configurePlugin: (pluginId: string, config: Record<string, any>) => Promise<void>;

  // 插件API
  executeHook: (hookName: string, ...args: any[]) => Promise<any[]>;
  registerPlugin: (plugin: Plugin, api: PluginAPI) => void;
  unregisterPlugin: (pluginId: string) => void;

  // 插件市场
  searchPlugins: (query: string) => Promise<Plugin[]>;
  getPluginDetails: (pluginId: string) => Promise<Plugin>;
  checkUpdates: () => Promise<string[]>;
}

// 内置插件列表
const builtinPlugins: Plugin[] = [
  {
    id: 'laravel-optimizer',
    name: 'Laravel优化器',
    version: '1.0.0',
    description: '专门针对Laravel项目的构建优化插件',
    author: 'PHP Desktop Packager Team',
    category: 'build',
    status: 'available',
    enabled: false,
    permissions: ['file:read', 'file:write', 'build:modify']
  },
  {
    id: 'wordpress-packager',
    name: 'WordPress打包器',
    version: '1.2.0',
    description: '专业的WordPress项目打包工具',
    author: 'Community',
    category: 'build',
    status: 'available',
    enabled: false,
    permissions: ['file:read', 'file:write', 'build:modify']
  },
  {
    id: 'debug-profiler',
    name: '性能分析器',
    version: '2.1.0',
    description: '实时性能监控和分析工具',
    author: 'Performance Team',
    category: 'debug',
    status: 'available',
    enabled: false,
    permissions: ['debug:monitor', 'network:access']
  },
  {
    id: 'theme-studio',
    name: '主题工作室',
    version: '1.5.0',
    description: '高级主题定制和UI扩展工具',
    author: 'UI Team',
    category: 'ui',
    status: 'available',
    enabled: false,
    permissions: ['ui:modify', 'theme:access']
  },
  {
    id: 'git-integration',
    name: 'Git集成',
    version: '3.0.0',
    description: '完整的Git版本控制集成',
    author: 'VCS Team',
    category: 'integration',
    status: 'available',
    enabled: false,
    permissions: ['vcs:access', 'file:read']
  },
  {
    id: 'docker-builder',
    name: 'Docker构建器',
    version: '1.8.0',
    description: '使用Docker容器进行项目构建',
    author: 'DevOps Team',
    category: 'build',
    status: 'available',
    enabled: false,
    permissions: ['docker:access', 'build:modify']
  }
];

// 插件API注册表
const pluginAPIs = new Map<string, PluginAPI>();

export const usePluginStore = create<PluginStore>()(
  persist(
    (set, get) => ({
      plugins: [],
      installedPlugins: [],
      availablePlugins: builtinPlugins,
      loading: false,
      installing: null,

      loadPlugins: async () => {
        set({ loading: true });
        try {
          // TODO: 从服务器加载插件列表
          await new Promise(resolve => setTimeout(resolve, 1000));

          const { plugins, availablePlugins } = get();

          // 从所有插件中筛选已安装的插件
          const allPlugins = [...plugins, ...availablePlugins];
          const uniquePlugins = allPlugins.reduce((acc, plugin) => {
            if (!acc.find(p => p.id === plugin.id)) {
              acc.push(plugin);
            } else {
              // 如果插件已存在，优先使用已安装的版本
              const existingIndex = acc.findIndex(p => p.id === plugin.id);
              if (plugin.status === 'installed' && acc[existingIndex].status !== 'installed') {
                acc[existingIndex] = plugin;
              }
            }
            return acc;
          }, [] as Plugin[]);

          const installed = uniquePlugins.filter(p => p.status === 'installed');
          const available = builtinPlugins.map(plugin => {
            const installedVersion = installed.find(p => p.id === plugin.id);
            return installedVersion || plugin;
          });

          set({
            installedPlugins: installed,
            availablePlugins: available
          });
        } catch (error) {
          console.error('加载插件失败:', error);
        } finally {
          set({ loading: false });
        }
      },

      installPlugin: async (pluginId: string) => {
        set({ installing: pluginId });
        try {
          // 模拟安装过程
          await new Promise(resolve => setTimeout(resolve, 2000));

          set(state => {
            // 找到要安装的插件
            const pluginToInstall = state.availablePlugins.find(p => p.id === pluginId);
            if (!pluginToInstall) {
              throw new Error(`插件 ${pluginId} 不存在`);
            }

            // 创建已安装的插件对象
            const installedPlugin = {
              ...pluginToInstall,
              status: 'installed' as const,
              enabled: true,
              installDate: new Date().toISOString()
            };

            // 更新插件状态
            const updatedPlugins = state.plugins.some(p => p.id === pluginId)
              ? state.plugins.map(p => p.id === pluginId ? installedPlugin : p)
              : [...state.plugins, installedPlugin];

            const updatedAvailablePlugins = state.availablePlugins.map(p =>
              p.id === pluginId ? installedPlugin : p
            );

            const updatedInstalledPlugins = state.installedPlugins.some(p => p.id === pluginId)
              ? state.installedPlugins.map(p => p.id === pluginId ? installedPlugin : p)
              : [...state.installedPlugins, installedPlugin];

            return {
              plugins: updatedPlugins,
              availablePlugins: updatedAvailablePlugins,
              installedPlugins: updatedInstalledPlugins
            };
          });
        } catch (error) {
          console.error('安装插件失败:', error);
          throw error;
        } finally {
          set({ installing: null });
        }
      },

      uninstallPlugin: async (pluginId: string) => {
        try {
          // 先禁用插件
          get().unregisterPlugin(pluginId);

          set(state => {
            // 找到原始插件信息（从内置插件中）
            const originalPlugin = builtinPlugins.find(p => p.id === pluginId);
            const resetPlugin = originalPlugin ? { ...originalPlugin } : null;

            return {
              plugins: state.plugins.map(p =>
                p.id === pluginId && resetPlugin
                  ? resetPlugin
                  : p.id === pluginId
                  ? { ...p, status: 'available' as const, enabled: false, installDate: undefined }
                  : p
              ),
              availablePlugins: state.availablePlugins.map(p =>
                p.id === pluginId && resetPlugin
                  ? resetPlugin
                  : p.id === pluginId
                  ? { ...p, status: 'available' as const, enabled: false, installDate: undefined }
                  : p
              ),
              installedPlugins: state.installedPlugins.filter(p => p.id !== pluginId)
            };
          });
        } catch (error) {
          console.error('卸载插件失败:', error);
          throw error;
        }
      },

      enablePlugin: async (pluginId: string) => {
        set(state => ({
          plugins: state.plugins.map(p =>
            p.id === pluginId ? { ...p, enabled: true } : p
          ),
          installedPlugins: state.installedPlugins.map(p =>
            p.id === pluginId ? { ...p, enabled: true } : p
          )
        }));
      },

      disablePlugin: async (pluginId: string) => {
        // 注销插件API
        get().unregisterPlugin(pluginId);

        set(state => ({
          plugins: state.plugins.map(p =>
            p.id === pluginId ? { ...p, enabled: false } : p
          ),
          installedPlugins: state.installedPlugins.map(p =>
            p.id === pluginId ? { ...p, enabled: false } : p
          )
        }));
      },

      updatePlugin: async (pluginId: string) => {
        set({ installing: pluginId });
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));

          set(state => ({
            plugins: state.plugins.map(p =>
              p.id === pluginId
                ? { ...p, lastUpdate: new Date().toISOString() }
                : p
            )
          }));
        } finally {
          set({ installing: null });
        }
      },

      configurePlugin: async (pluginId: string, config: Record<string, any>) => {
        set(state => ({
          plugins: state.plugins.map(p =>
            p.id === pluginId ? { ...p, config } : p
          )
        }));
      },

      executeHook: async (hookName: string, ...args: any[]) => {
        const results: any[] = [];
        const { installedPlugins } = get();

        for (const plugin of installedPlugins.filter(p => p.enabled)) {
          const api = pluginAPIs.get(plugin.id);
          if (api && (api as any)[hookName]) {
            try {
              const result = await (api as any)[hookName](...args);
              results.push(result);
            } catch (error) {
              console.error(`插件 ${plugin.id} 执行钩子 ${hookName} 失败:`, error);
            }
          }
        }

        return results;
      },

      registerPlugin: (plugin: Plugin, api: PluginAPI) => {
        pluginAPIs.set(plugin.id, api);
      },

      unregisterPlugin: (pluginId: string) => {
        pluginAPIs.delete(pluginId);
      },

      searchPlugins: async (query: string) => {
        const { availablePlugins } = get();
        return availablePlugins.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        );
      },

      getPluginDetails: async (pluginId: string) => {
        const { plugins, availablePlugins } = get();
        return [...plugins, ...availablePlugins].find(p => p.id === pluginId)!;
      },

      checkUpdates: async () => {
        // TODO: 检查插件更新
        return [];
      }
    }),
    {
      name: 'plugin-storage',
      partialize: (state) => ({
        plugins: state.plugins.map(p => ({
          ...p,
          // 不持久化API相关数据
          api: undefined
        }))
      })
    }
  )
);
