import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme, ThemeMode } from '../theme/ThemeContext';

interface ThemeSettingsProps {
  onClose?: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ onClose }) => {
  const { theme, themeMode, setThemeMode, isSystemFollowing } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.inputBorder,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    closeButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    closeButtonText: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
      lineHeight: 20,
    },
    optionContainer: {
      marginBottom: theme.spacing.md,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    activeOption: {
      backgroundColor: theme.colors.primary,
    },
    optionIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    optionDescription: {
      fontSize: 14,
      lineHeight: 18,
    },
    activeOptionTitle: {
      color: theme.colors.buttonText,
    },
    activeOptionDescription: {
      color: theme.colors.buttonText,
      opacity: 0.8,
    },
    inactiveOptionTitle: {
      color: theme.colors.text,
    },
    inactiveOptionDescription: {
      color: theme.colors.textSecondary,
    },
    statusIndicator: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
    },
    statusText: {
      color: theme.colors.buttonText,
      fontSize: 12,
      fontWeight: '600',
    },
    previewSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    previewTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    previewText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
  }), [theme]);

  const themeOptions = [
    {
      mode: ThemeMode.LIGHT,
      icon: '🌞',
      title: '亮色模式',
      description: '使用明亮的颜色主题，适合在光线充足的环境下使用',
    },
    {
      mode: ThemeMode.DARK,
      icon: '🌙',
      title: '暗色模式',
      description: '使用深色主题，减少眼部疲劳，适合在暗光环境下使用',
    },
    {
      mode: ThemeMode.SYSTEM,
      icon: '🔄',
      title: '跟随系统',
      description: '自动跟随系统的明暗模式设置，随系统变化而切换',
    },
  ];

  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>主题设置</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>完成</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>外观模式</Text>
        <Text style={styles.sectionDescription}>
          选择您喜欢的主题模式。您可以选择固定的亮色或暗色模式，也可以让应用跟随系统设置自动切换。
        </Text>

        {themeOptions.map((option) => {
          const isActive = themeMode === option.mode;
          return (
            <View key={option.mode} style={styles.optionContainer}>
              <TouchableOpacity
                style={[styles.option, isActive && styles.activeOption]}
                onPress={() => handleThemeModeChange(option.mode)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isActive ? styles.activeOptionTitle : styles.inactiveOptionTitle,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      isActive ? styles.activeOptionDescription : styles.inactiveOptionDescription,
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
                {isActive && (
                  <View style={styles.statusIndicator}>
                    <Text style={styles.statusText}>当前</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>主题预览</Text>
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>
            当前主题：{theme.isDark ? '暗色模式' : '亮色模式'}
            {isSystemFollowing && ' (跟随系统)'}
          </Text>
          <Text style={styles.previewText}>
            这是当前主题的预览效果。您可以看到文字颜色、背景色和其他界面元素在当前主题下的显示效果。
            主题设置会自动保存，下次打开应用时会记住您的选择。
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ThemeSettings;