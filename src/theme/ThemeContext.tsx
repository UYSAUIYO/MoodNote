import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 主题类型定义
export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    inputBackground: string;
    inputBorder: string;
    shadow: string;
    buttonText: string;
    placeholder: string;
    accent: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// 亮色主题
const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: '#a8998a',
    background: '#d4c5b9',
    surface: 'rgba(255, 255, 255, 0.9)',
    text: '#6b5b73',
    textSecondary: '#8b7d8b',
    inputBackground: '#f5f3f0',
    inputBorder: 'rgba(171, 158, 147, 0.3)',
    shadow: '#6b5b73',
    buttonText: '#ffffff',
    placeholder: '#999999',
    accent: '#a8998a',
    error: '#d63031',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

// 暗色主题
const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#8a7a6b',
    background: '#2c2420',
    surface: 'rgba(60, 50, 45, 0.9)',
    text: '#e8ddd4',
    textSecondary: '#c4b5a0',
    inputBackground: '#3c322d',
    inputBorder: 'rgba(200, 180, 160, 0.2)',
    shadow: '#000000',
    buttonText: '#ffffff',
    placeholder: '#888888',
    accent: '#8a7a6b',
    error: '#ff6b6b',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

// 主题模式枚举
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

// 主题上下文
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isSystemFollowing: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 存储键名
const THEME_STORAGE_KEY = '@MoodNote:themeMode';

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(ThemeMode.SYSTEM);
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化主题设置
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedThemeMode && Object.values(ThemeMode).includes(savedThemeMode as ThemeMode)) {
          setThemeModeState(savedThemeMode as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeTheme();
  }, []);

  // 根据主题模式和系统设置更新isDark状态
  useEffect(() => {
    if (!isInitialized) return;

    switch (themeMode) {
      case ThemeMode.LIGHT:
        setIsDark(false);
        break;
      case ThemeMode.DARK:
        setIsDark(true);
        break;
      case ThemeMode.SYSTEM:
        setIsDark(systemColorScheme === 'dark');
        break;
    }
  }, [themeMode, systemColorScheme, isInitialized]);

  // 设置主题模式并持久化
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, []);

  // 切换主题（在亮色、暗色、跟随系统之间循环）
  const toggleTheme = useCallback(() => {
    const modes = [ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.SYSTEM];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  }, [themeMode, setThemeMode]);

  // 是否正在跟随系统主题
  const isSystemFollowing = themeMode === ThemeMode.SYSTEM;

  const theme = isDark ? darkTheme : lightTheme;

  // 在初始化完成前不渲染，避免闪烁
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDark, 
        themeMode, 
        toggleTheme, 
        setThemeMode, 
        isSystemFollowing 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// 主题钩子
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { lightTheme, darkTheme };
export { ThemeUtils, ThemeConstants } from './ThemeUtils';
export { useThemeManager, useSimpleTheme, useThemeStatus, useThemeStyles } from './useThemeManager';