import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PhpProject {
  id: string;
  name: string;
  path: string;
  project_type: string;
  entry_file: string;
  created_at: string;
  last_modified: string;
  server_port?: number;
  is_running?: boolean;
}

export interface BuildConfig {
  appName: string;
  appVersion: string;
  appDescription: string;
  appIcon?: string;
  targetPlatforms: string[];
  windowWidth: number;
  windowHeight: number;
  windowResizable: boolean;
  windowFullscreen: boolean;
  phpVersion: string;
  outputDir: string;
  includePhpExtensions: string[];
  customCommands: string;
}

interface ProjectStore {
  // 项目管理
  projects: PhpProject[];
  selectedProject: PhpProject | null;
  addProject: (project: PhpProject) => void;
  removeProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<PhpProject>) => void;
  selectProject: (project: PhpProject | null) => void;
  
  // 构建配置
  buildConfig: BuildConfig;
  updateBuildConfig: (config: Partial<BuildConfig>) => void;
  
  // 应用状态
  isBuilding: boolean;
  buildProgress: number;
  setBuilding: (building: boolean) => void;
  setBuildProgress: (progress: number) => void;
}

const defaultBuildConfig: BuildConfig = {
  appName: 'My PHP App',
  appVersion: '1.0.0',
  appDescription: '',
  targetPlatforms: ['windows-x64'],
  windowWidth: 1200,
  windowHeight: 800,
  windowResizable: true,
  windowFullscreen: false,
  phpVersion: '8.2',
  outputDir: './dist',
  includePhpExtensions: ['curl', 'gd', 'mbstring', 'mysqli', 'pdo'],
  customCommands: ''
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      projects: [],
      selectedProject: null,
      buildConfig: defaultBuildConfig,
      isBuilding: false,
      buildProgress: 0,

      // 项目管理方法
      addProject: (project) => {
        set((state) => ({
          projects: [...state.projects, project]
        }));
      },

      removeProject: (projectId) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== projectId),
          selectedProject: state.selectedProject?.id === projectId ? null : state.selectedProject
        }));
      },

      updateProject: (projectId, updates) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId ? { ...p, ...updates } : p
          ),
          selectedProject: state.selectedProject?.id === projectId 
            ? { ...state.selectedProject, ...updates } 
            : state.selectedProject
        }));
      },

      selectProject: (project) => {
        set({ selectedProject: project });
      },

      // 构建配置方法
      updateBuildConfig: (config) => {
        set((state) => ({
          buildConfig: { ...state.buildConfig, ...config }
        }));
      },

      // 应用状态方法
      setBuilding: (building) => {
        set({ isBuilding: building });
      },

      setBuildProgress: (progress) => {
        set({ buildProgress: progress });
      }
    }),
    {
      name: 'php-packager-storage',
      partialize: (state) => ({
        projects: state.projects,
        buildConfig: state.buildConfig
      })
    }
  )
);
