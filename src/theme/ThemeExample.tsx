import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import {
  useTheme,
  useThemeManager,
  useSimpleTheme,
  useThemeStyles,
  ThemeMode,
  ThemeUtils,
} from './ThemeContext';
import ThemeSettings from '../components/ThemeSettings';

/**
 * 主题系统使用示例组件
 * 展示如何在实际项目中使用新的主题系统
 */
const ThemeExample: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* 基础主题使用示例 */}
      <BasicThemeExample />
      
      {/* 高级主题管理示例 */}
      <AdvancedThemeExample />
      
      {/* 简化主题使用示例 */}
      <SimpleThemeExample />
      
      {/* 主题样式工具示例 */}
      <ThemeStylesExample />
      
      {/* 主题设置组件示例 */}
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 10,
          }}
          onPress={() => setShowSettings(true)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            打开主题设置
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            backgroundColor: '#34C759',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {showAdvanced ? '隐藏' : '显示'}高级功能
          </Text>
        </TouchableOpacity>
        
        {showAdvanced && <AdvancedFeaturesExample />}
      </View>
      
      {/* 主题设置模态框 */}
      {showSettings && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <View style={{
            flex: 1,
            marginTop: 50,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
            <ThemeSettings onClose={() => setShowSettings(false)} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

/**
 * 基础主题使用示例
 */
const BasicThemeExample: React.FC = () => {
  const { theme, isDark, themeMode, toggleTheme, setThemeMode, isSystemFollowing } = useTheme();
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    info: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center' as const,
      marginTop: theme.spacing.md,
    },
    buttonText: {
      color: theme.colors.buttonText,
      fontWeight: '600' as const,
    },
  }), [theme]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>基础主题使用 (useTheme)</Text>
      <Text style={styles.info}>当前模式: {ThemeUtils.getThemeModeDisplayName(themeMode)}</Text>
      <Text style={styles.info}>是否暗色: {isDark ? '是' : '否'}</Text>
      <Text style={styles.info}>跟随系统: {isSystemFollowing ? '是' : '否'}</Text>
      
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Text style={styles.buttonText}>切换主题模式</Text>
      </TouchableOpacity>
      
      <View style={{
        flexDirection: 'row' as const, marginTop: theme.spacing.md }}>
        <TouchableOpacity
          style={[styles.button, { flex: 1, marginRight: theme.spacing.sm }]}
          onPress={() => setThemeMode(ThemeMode.LIGHT)}
        >
          <Text style={styles.buttonText}>🌞 亮色</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { flex: 1, marginHorizontal: theme.spacing.sm }]}
          onPress={() => setThemeMode(ThemeMode.DARK)}
        >
          <Text style={styles.buttonText}>🌙 暗色</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { flex: 1, marginLeft: theme.spacing.sm }]}
          onPress={() => setThemeMode(ThemeMode.SYSTEM)}
        >
          <Text style={styles.buttonText}>🔄 系统</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * 高级主题管理示例
 */
const AdvancedThemeExample: React.FC = () => {
  const {
    theme,
    isTransitioning,
    systemColorScheme,
    switchToNextTheme,
    switchToPreviousTheme,
    getThemeStatus,
    getAvailableThemes,
    canSwitchTheme,
  } = useThemeManager();
  
  const themeStatus = getThemeStatus();
  const availableThemes = getAvailableThemes();
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    statusContainer: {
      backgroundColor: theme.colors.inputBackground,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    statusText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    themeOption: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
    },
    activeThemeOption: {
      backgroundColor: theme.colors.primary,
    },
    inactiveThemeOption: {
      backgroundColor: theme.colors.inputBackground,
    },
    themeOptionText: {
      marginLeft: theme.spacing.sm,
      fontSize: 14,
      fontWeight: '600' as const,
    },
    activeThemeOptionText: {
      color: theme.colors.buttonText,
    },
    inactiveThemeOptionText: {
      color: theme.colors.text,
    },
    controlButton: {
      backgroundColor: theme.colors.accent,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center' as const,
      marginHorizontal: theme.spacing.sm,
      flex: 1,
    },
    controlButtonText: {
      color: theme.colors.buttonText,
      fontWeight: '600' as const,
      fontSize: 12,
    },
  }), [theme]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>高级主题管理 (useThemeManager)</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>状态描述: {themeStatus.statusDescription}</Text>
        <Text style={styles.statusText}>系统主题: {systemColorScheme || '未知'}</Text>
        <Text style={styles.statusText}>切换中: {isTransitioning ? '是' : '否'}</Text>
        <Text style={styles.statusText}>可切换: {canSwitchTheme() ? '是' : '否'}</Text>
      </View>
      
      <Text style={[styles.statusText, { marginBottom: theme.spacing.md }]}>可用主题:</Text>
      {availableThemes.map((themeConfig) => (
        <View
          key={themeConfig.mode}
          style={[
            styles.themeOption,
            themeConfig.isActive ? styles.activeThemeOption : styles.inactiveThemeOption,
          ]}
        >
          <Text style={{ fontSize: 16 }}>{themeConfig.icon}</Text>
          <Text
            style={[
              styles.themeOptionText,
              themeConfig.isActive ? styles.activeThemeOptionText : styles.inactiveThemeOptionText,
            ]}
          >
            {themeConfig.displayName}
            {themeConfig.isActive && ' (当前)'}
          </Text>
        </View>
      ))}
      
      <View style={{ flexDirection: 'row' as const, marginTop: theme.spacing.md }}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={switchToPreviousTheme}
          disabled={!canSwitchTheme()}
        >
          <Text style={styles.controlButtonText}>← 上一个</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={switchToNextTheme}
          disabled={!canSwitchTheme()}
        >
          <Text style={styles.controlButtonText}>下一个 →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * 简化主题使用示例
 */
const SimpleThemeExample: React.FC = () => {
  const { theme, isDark, colors, spacing, borderRadius } = useSimpleTheme();
  
  return (
    <View style={{
      backgroundColor: colors.surface,
      margin: spacing.md,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold' as const,
        color: theme.colors.text,
        marginBottom: spacing.md,
      }}>
        简化主题使用 (useSimpleTheme)
      </Text>
      
      <Text style={{
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
      }}>
        这个示例展示了如何使用简化的主题 Hook，只获取必要的主题信息。
      </Text>
      
      <View style={{
        backgroundColor: colors.inputBackground,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.md,
      }}>
        <Text style={{ color: colors.text, fontSize: 12 }}>
          当前主题: {isDark ? '暗色' : '亮色'}
        </Text>
      </View>
    </View>
  );
};

/**
 * 主题样式工具示例
 */
const ThemeStylesExample: React.FC = () => {
  const { addOpacity, createStyles } = useThemeStyles();
  
  const styles = createStyles((theme) => ({
    container: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: addOpacity(theme.colors.primary, 0.3),
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    colorBox: {
      height: 40,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    colorText: {
      fontSize: 12,
      fontWeight: '600' as const,
    },
  }));
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>主题样式工具 (useThemeStyles)</Text>
      
      <Text style={{
        fontSize: 14,
        color: styles.title.color,
        marginBottom: 16,
      } as const}>
        演示透明度颜色效果:
      </Text>
      
      <View style={[
        styles.colorBox,
        { backgroundColor: addOpacity('#FF0000', 0.8) }
      ]}>
        <Text style={[styles.colorText, { color: 'white' }]}>红色 80% 透明度</Text>
      </View>
      
      <View style={[
        styles.colorBox,
        { backgroundColor: addOpacity('#00FF00', 0.6) }
      ]}>
        <Text style={[styles.colorText, { color: 'white' }]}>绿色 60% 透明度</Text>
      </View>
      
      <View style={[
        styles.colorBox,
        { backgroundColor: addOpacity('#0000FF', 0.4) }
      ]}>
        <Text style={[styles.colorText, { color: 'white' }]}>蓝色 40% 透明度</Text>
      </View>
    </View>
  );
};

/**
 * 高级功能示例
 */
const AdvancedFeaturesExample: React.FC = () => {
  const { theme } = useTheme();
  const { resetToDefault } = useThemeManager();
  
  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      marginTop: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
    }}>
      <Text style={{
        fontSize: 16,
        fontWeight: 'bold' as const,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
      }}>
        高级功能
      </Text>
      
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.error,
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.md,
          alignItems: 'center' as const,
        }}
        onPress={resetToDefault}
      >
        <Text style={{
          color: theme.colors.buttonText,
          fontWeight: '600' as const,
        }}>
          重置为默认主题
        </Text>
      </TouchableOpacity>
      
      <Text style={{
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.sm,
        textAlign: 'center' as const,
      }}>
        这将重置主题设置为跟随系统模式
      </Text>
    </View>
  );
};

export default ThemeExample;