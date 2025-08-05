import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

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

// 主题上下文
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isManualOverride, setIsManualOverride] = useState(false);

  // 只有在没有手动切换时才跟随系统主题
  useEffect(() => {
    if (!isManualOverride && systemColorScheme !== null) {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, isManualOverride]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    setIsManualOverride(true);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
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