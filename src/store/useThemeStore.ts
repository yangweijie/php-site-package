import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red';

export interface ThemeConfig {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  animations: boolean;
}

interface ThemeStore {
  // 主题配置
  config: ThemeConfig;
  
  // 当前实际主题模式（考虑系统主题）
  actualMode: 'light' | 'dark';
  
  // 主题操作
  setThemeMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setCompactMode: (compact: boolean) => void;
  setBorderRadius: (radius: 'none' | 'small' | 'medium' | 'large') => void;
  setAnimations: (enabled: boolean) => void;
  resetTheme: () => void;
  
  // 工具方法
  getThemeToken: () => any;
  updateActualMode: () => void;
}

const defaultConfig: ThemeConfig = {
  mode: 'light',
  colorScheme: 'blue',
  fontSize: 'medium',
  compactMode: false,
  borderRadius: 'medium',
  animations: true
};

// 颜色方案配置
const colorSchemes = {
  blue: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f'
  },
  green: {
    primary: '#52c41a',
    success: '#73d13d',
    warning: '#faad14',
    error: '#ff4d4f'
  },
  purple: {
    primary: '#722ed1',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f'
  },
  orange: {
    primary: '#fa8c16',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f'
  },
  red: {
    primary: '#f5222d',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f'
  }
};

// 字体大小配置
const fontSizes = {
  small: {
    fontSize: 12,
    fontSizeLG: 14,
    fontSizeXL: 16
  },
  medium: {
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 18
  },
  large: {
    fontSize: 16,
    fontSizeLG: 18,
    fontSizeXL: 20
  }
};

// 边框圆角配置
const borderRadiusConfig = {
  none: 0,
  small: 2,
  medium: 6,
  large: 12
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      actualMode: 'light',

      setThemeMode: (mode) => {
        set((state) => ({
          config: { ...state.config, mode }
        }));
        get().updateActualMode();
      },

      setColorScheme: (colorScheme) => {
        set((state) => ({
          config: { ...state.config, colorScheme }
        }));
      },

      setFontSize: (fontSize) => {
        set((state) => ({
          config: { ...state.config, fontSize }
        }));
      },

      setCompactMode: (compactMode) => {
        set((state) => ({
          config: { ...state.config, compactMode }
        }));
      },

      setBorderRadius: (borderRadius) => {
        set((state) => ({
          config: { ...state.config, borderRadius }
        }));
      },

      setAnimations: (animations) => {
        set((state) => ({
          config: { ...state.config, animations }
        }));
      },

      resetTheme: () => {
        set({ config: defaultConfig });
        get().updateActualMode();
      },

      updateActualMode: () => {
        const { config } = get();
        let actualMode: 'light' | 'dark' = 'light';

        if (config.mode === 'dark') {
          actualMode = 'dark';
        } else if (config.mode === 'auto') {
          // 检测系统主题
          if (typeof window !== 'undefined') {
            actualMode = window.matchMedia('(prefers-color-scheme: dark)').matches 
              ? 'dark' 
              : 'light';
          }
        }

        set({ actualMode });
      },

      getThemeToken: () => {
        const { config, actualMode } = get();
        const colors = colorSchemes[config.colorScheme];
        const fonts = fontSizes[config.fontSize];
        const borderRadius = borderRadiusConfig[config.borderRadius];

        return {
          // 颜色配置
          colorPrimary: colors.primary,
          colorSuccess: colors.success,
          colorWarning: colors.warning,
          colorError: colors.error,
          
          // 字体配置
          fontSize: fonts.fontSize,
          fontSizeLG: fonts.fontSizeLG,
          fontSizeXL: fonts.fontSizeXL,
          
          // 边框圆角
          borderRadius: borderRadius,
          borderRadiusLG: borderRadius * 1.5,
          borderRadiusXS: borderRadius * 0.5,
          
          // 紧凑模式
          controlHeight: config.compactMode ? 28 : 32,
          controlHeightLG: config.compactMode ? 36 : 40,
          controlHeightSM: config.compactMode ? 20 : 24,
          
          // 间距
          padding: config.compactMode ? 12 : 16,
          paddingLG: config.compactMode ? 16 : 24,
          paddingSM: config.compactMode ? 8 : 12,
          
          // 动画
          motionDurationSlow: config.animations ? '0.3s' : '0s',
          motionDurationMid: config.animations ? '0.2s' : '0s',
          motionDurationFast: config.animations ? '0.1s' : '0s',
          
          // 暗色主题特定配置
          ...(actualMode === 'dark' && {
            colorBgContainer: '#141414',
            colorBgElevated: '#1f1f1f',
            colorBgLayout: '#000000',
            colorText: 'rgba(255, 255, 255, 0.85)',
            colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
            colorBorder: '#303030',
            colorSplit: '#303030'
          })
        };
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ config: state.config })
    }
  )
);

// 监听系统主题变化
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    useThemeStore.getState().updateActualMode();
  });
  
  // 初始化时更新主题
  useThemeStore.getState().updateActualMode();
}
