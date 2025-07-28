import { Theme, ThemeMode } from './ThemeContext';
import { Appearance } from 'react-native';

/**
 * 主题工具类
 * 提供主题相关的实用功能
 */
export class ThemeUtils {
  /**
   * 获取主题模式的显示名称
   */
  static getThemeModeDisplayName(mode: ThemeMode): string {
    switch (mode) {
      case ThemeMode.LIGHT:
        return '亮色模式';
      case ThemeMode.DARK:
        return '暗色模式';
      case ThemeMode.SYSTEM:
        return '跟随系统';
      default:
        return '未知模式';
    }
  }

  /**
   * 获取主题模式的图标
   */
  static getThemeModeIcon(mode: ThemeMode): string {
    switch (mode) {
      case ThemeMode.LIGHT:
        return '🌞';
      case ThemeMode.DARK:
        return '🌙';
      case ThemeMode.SYSTEM:
        return '🔄';
      default:
        return '❓';
    }
  }

  /**
   * 获取主题模式的描述
   */
  static getThemeModeDescription(mode: ThemeMode): string {
    switch (mode) {
      case ThemeMode.LIGHT:
        return '使用明亮的颜色主题，适合在光线充足的环境下使用';
      case ThemeMode.DARK:
        return '使用深色主题，减少眼部疲劳，适合在暗光环境下使用';
      case ThemeMode.SYSTEM:
        return '自动跟随系统的明暗模式设置，随系统变化而切换';
      default:
        return '未知的主题模式';
    }
  }

  /**
   * 检查当前系统是否为暗色模式
   */
  static isSystemDarkMode(): boolean {
    return Appearance.getColorScheme() === 'dark';
  }

  /**
   * 根据主题模式和系统设置确定是否应该使用暗色主题
   */
  static shouldUseDarkTheme(mode: ThemeMode): boolean {
    switch (mode) {
      case ThemeMode.LIGHT:
        return false;
      case ThemeMode.DARK:
        return true;
      case ThemeMode.SYSTEM:
        return this.isSystemDarkMode();
      default:
        return false;
    }
  }

  /**
   * 获取下一个主题模式（用于循环切换）
   */
  static getNextThemeMode(currentMode: ThemeMode): ThemeMode {
    const modes = [ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.SYSTEM];
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    return modes[nextIndex];
  }

  /**
   * 获取上一个主题模式（用于反向循环切换）
   */
  static getPreviousThemeMode(currentMode: ThemeMode): ThemeMode {
    const modes = [ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.SYSTEM];
    const currentIndex = modes.indexOf(currentMode);
    const previousIndex = currentIndex === 0 ? modes.length - 1 : currentIndex - 1;
    return modes[previousIndex];
  }

  /**
   * 将颜色转换为带透明度的颜色
   */
  static addOpacityToColor(color: string, opacity: number): string {
    // 如果颜色已经包含透明度信息，直接返回
    if (color.includes('rgba') || color.includes('hsla')) {
      return color;
    }

    // 处理十六进制颜色
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // 处理rgb颜色
    if (color.startsWith('rgb(')) {
      const values = color.match(/\d+/g);
      if (values && values.length >= 3) {
        return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
      }
    }

    // 如果无法解析，返回原颜色
    return color;
  }

  /**
   * 根据背景颜色自动选择合适的文字颜色
   */
  static getContrastTextColor(backgroundColor: string, theme: Theme): string {
    // 简单的对比度检查，实际项目中可以使用更复杂的算法
    if (theme.isDark) {
      return theme.colors.text;
    } else {
      return theme.colors.text;
    }
  }

  /**
   * 创建主题相关的样式对象
   */
  static createThemedStyles<T>(styleCreator: (theme: Theme) => T, theme: Theme): T {
    return styleCreator(theme);
  }

  /**
   * 获取主题切换的状态描述
   */
  static getThemeStatusDescription(mode: ThemeMode, isDark: boolean): string {
    if (mode === ThemeMode.SYSTEM) {
      return `跟随系统 (当前: ${isDark ? '暗色' : '亮色'})`;
    }
    return this.getThemeModeDisplayName(mode);
  }

  /**
   * 验证主题模式是否有效
   */
  static isValidThemeMode(mode: string): mode is ThemeMode {
    return Object.values(ThemeMode).includes(mode as ThemeMode);
  }

  /**
   * 获取所有可用的主题模式
   */
  static getAllThemeModes(): ThemeMode[] {
    return [ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.SYSTEM];
  }

  /**
   * 获取主题模式的配置信息
   */
  static getThemeModeConfig(mode: ThemeMode) {
    return {
      mode,
      displayName: this.getThemeModeDisplayName(mode),
      icon: this.getThemeModeIcon(mode),
      description: this.getThemeModeDescription(mode),
    };
  }

  /**
   * 获取所有主题模式的配置信息
   */
  static getAllThemeModesConfig() {
    return this.getAllThemeModes().map(mode => this.getThemeModeConfig(mode));
  }
}

/**
 * 主题相关的常量
 */
export const ThemeConstants = {
  // 存储键名
  STORAGE_KEY: '@MoodNote:themeMode',
  
  // 动画持续时间
  ANIMATION_DURATION: 300,
  
  // 默认主题模式
  DEFAULT_MODE: ThemeMode.SYSTEM,
  
  // 主题切换延迟（避免频繁切换）
  SWITCH_DEBOUNCE_TIME: 100,
} as const;

/**
 * 主题相关的类型定义
 */
export interface ThemeConfig {
  mode: ThemeMode;
  displayName: string;
  icon: string;
  description: string;
}

export interface ThemePreference {
  mode: ThemeMode;
  lastUpdated: number;
  isSystemFollowing: boolean;
}