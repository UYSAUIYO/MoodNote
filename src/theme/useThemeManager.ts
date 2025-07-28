import { useCallback, useEffect, useState } from 'react';
import { Appearance, AppState, AppStateStatus } from 'react-native';
import { useTheme, ThemeMode } from './ThemeContext';
import { ThemeUtils, ThemeConstants } from './ThemeUtils';

/**
 * 主题管理Hook
 * 提供更高级的主题管理功能
 */
export const useThemeManager = () => {
  const themeContext = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [systemColorScheme, setSystemColorScheme] = useState(Appearance.getColorScheme());

  // 监听系统主题变化
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // 监听应用状态变化，确保主题同步
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && themeContext.themeMode === ThemeMode.SYSTEM) {
        // 应用重新激活时，如果是跟随系统模式，检查系统主题是否有变化
        const currentSystemScheme = Appearance.getColorScheme();
        if (currentSystemScheme !== systemColorScheme) {
          setSystemColorScheme(currentSystemScheme);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [themeContext.themeMode, systemColorScheme]);

  /**
   * 切换到下一个主题模式
   */
  const switchToNextTheme = useCallback(async () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const nextMode = ThemeUtils.getNextThemeMode(themeContext.themeMode);
    
    try {
      await themeContext.setThemeMode(nextMode);
    } finally {
      setTimeout(() => {
        setIsTransitioning(false);
      }, ThemeConstants.SWITCH_DEBOUNCE_TIME);
    }
  }, [themeContext.themeMode, themeContext.setThemeMode, isTransitioning]);

  /**
   * 切换到上一个主题模式
   */
  const switchToPreviousTheme = useCallback(async () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const previousMode = ThemeUtils.getPreviousThemeMode(themeContext.themeMode);
    
    try {
      await themeContext.setThemeMode(previousMode);
    } finally {
      setTimeout(() => {
        setIsTransitioning(false);
      }, ThemeConstants.SWITCH_DEBOUNCE_TIME);
    }
  }, [themeContext.themeMode, themeContext.setThemeMode, isTransitioning]);

  /**
   * 直接设置主题模式
   */
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    if (isTransitioning || mode === themeContext.themeMode) return;
    
    setIsTransitioning(true);
    
    try {
      await themeContext.setThemeMode(mode);
    } finally {
      setTimeout(() => {
        setIsTransitioning(false);
      }, ThemeConstants.SWITCH_DEBOUNCE_TIME);
    }
  }, [themeContext.themeMode, themeContext.setThemeMode, isTransitioning]);

  /**
   * 切换到亮色模式
   */
  const switchToLightMode = useCallback(() => {
    return setThemeMode(ThemeMode.LIGHT);
  }, [setThemeMode]);

  /**
   * 切换到暗色模式
   */
  const switchToDarkMode = useCallback(() => {
    return setThemeMode(ThemeMode.DARK);
  }, [setThemeMode]);

  /**
   * 切换到跟随系统模式
   */
  const switchToSystemMode = useCallback(() => {
    return setThemeMode(ThemeMode.SYSTEM);
  }, [setThemeMode]);

  /**
   * 获取当前主题状态信息
   */
  const getThemeStatus = useCallback(() => {
    return {
      currentMode: themeContext.themeMode,
      isDark: themeContext.isDark,
      isSystemFollowing: themeContext.isSystemFollowing,
      systemColorScheme,
      isTransitioning,
      displayName: ThemeUtils.getThemeModeDisplayName(themeContext.themeMode),
      icon: ThemeUtils.getThemeModeIcon(themeContext.themeMode),
      description: ThemeUtils.getThemeModeDescription(themeContext.themeMode),
      statusDescription: ThemeUtils.getThemeStatusDescription(themeContext.themeMode, themeContext.isDark),
    };
  }, [
    themeContext.themeMode,
    themeContext.isDark,
    themeContext.isSystemFollowing,
    systemColorScheme,
    isTransitioning,
  ]);

  /**
   * 获取所有可用的主题模式配置
   */
  const getAvailableThemes = useCallback(() => {
    return ThemeUtils.getAllThemeModesConfig().map(config => ({
      ...config,
      isActive: config.mode === themeContext.themeMode,
      isSystemCurrent: config.mode === ThemeMode.SYSTEM && themeContext.isSystemFollowing,
    }));
  }, [themeContext.themeMode, themeContext.isSystemFollowing]);

  /**
   * 检查是否可以切换主题（防止频繁切换）
   */
  const canSwitchTheme = useCallback(() => {
    return !isTransitioning;
  }, [isTransitioning]);

  /**
   * 重置主题到默认设置
   */
  const resetToDefault = useCallback(() => {
    return setThemeMode(ThemeConstants.DEFAULT_MODE);
  }, [setThemeMode]);

  /**
   * 获取主题相关的样式辅助函数
   */
  const getStyleHelpers = useCallback(() => {
    return {
      addOpacity: (color: string, opacity: number) => 
        ThemeUtils.addOpacityToColor(color, opacity),
      getContrastText: (backgroundColor: string) => 
        ThemeUtils.getContrastTextColor(backgroundColor, themeContext.theme),
      createStyles: <T>(styleCreator: (theme: typeof themeContext.theme) => T): T => 
        ThemeUtils.createThemedStyles(styleCreator, themeContext.theme),
    };
  }, [themeContext.theme]);

  return {
    // 基础主题信息
    theme: themeContext.theme,
    themeMode: themeContext.themeMode,
    isDark: themeContext.isDark,
    isSystemFollowing: themeContext.isSystemFollowing,
    
    // 状态信息
    isTransitioning,
    systemColorScheme,
    
    // 主题切换方法
    toggleTheme: themeContext.toggleTheme,
    switchToNextTheme,
    switchToPreviousTheme,
    setThemeMode,
    switchToLightMode,
    switchToDarkMode,
    switchToSystemMode,
    resetToDefault,
    
    // 信息获取方法
    getThemeStatus,
    getAvailableThemes,
    canSwitchTheme,
    getStyleHelpers,
  };
};

/**
 * 简化版的主题Hook，只提供基本功能
 */
export const useSimpleTheme = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return {
    theme,
    isDark,
    toggleTheme,
    colors: theme.colors,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
  };
};

/**
 * 主题状态Hook，用于获取主题状态信息
 */
export const useThemeStatus = () => {
  const themeManager = useThemeManager();
  return themeManager.getThemeStatus();
};

/**
 * 主题样式Hook，提供样式相关的辅助功能
 */
export const useThemeStyles = () => {
  const themeManager = useThemeManager();
  return themeManager.getStyleHelpers();
};