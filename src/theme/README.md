# MoodNote 主题系统

## 概述

MoodNote 应用的主题系统经过重构，现在提供了更强大和灵活的主题管理功能。新的主题系统支持三种模式：亮色模式、暗色模式和跟随系统模式，并且具有持久化存储、自动同步等高级功能。

## 主要特性

### 🎨 三种主题模式
- **亮色模式** (`ThemeMode.LIGHT`): 明亮的颜色主题，适合光线充足的环境
- **暗色模式** (`ThemeMode.DARK`): 深色主题，减少眼部疲劳，适合暗光环境
- **跟随系统** (`ThemeMode.SYSTEM`): 自动跟随系统的明暗模式设置

### 💾 持久化存储
- 用户的主题选择会自动保存到本地存储
- 应用重启后会记住用户的主题偏好
- 使用 AsyncStorage 进行可靠的数据持久化

### 🔄 智能同步
- 跟随系统模式下，实时监听系统主题变化
- 应用从后台恢复时自动检查系统主题状态
- 防抖机制避免频繁切换造成的性能问题

### 🛠 开发者友好
- 提供多个 Hook 满足不同使用场景
- 丰富的工具函数简化主题相关操作
- 完整的 TypeScript 类型支持

## 核心组件

### ThemeContext
主题上下文提供者，管理全局主题状态。

```tsx
import { ThemeProvider } from './src/theme/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <YourAppContent />
    </ThemeProvider>
  );
}
```

### ThemeSettings 组件
完整的主题设置界面，提供用户友好的主题选择体验。

```tsx
import ThemeSettings from './src/components/ThemeSettings';

function SettingsScreen() {
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  
  return (
    <View>
      <TouchableOpacity onPress={() => setShowThemeSettings(true)}>
        <Text>主题设置</Text>
      </TouchableOpacity>
      
      {showThemeSettings && (
        <ThemeSettings onClose={() => setShowThemeSettings(false)} />
      )}
    </View>
  );
}
```

## Hook 使用指南

### useTheme (基础 Hook)
最基本的主题 Hook，提供核心主题功能。

```tsx
import { useTheme } from './src/theme/ThemeContext';

function MyComponent() {
  const { theme, isDark, themeMode, toggleTheme, setThemeMode, isSystemFollowing } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>
        当前主题: {isDark ? '暗色' : '亮色'}
      </Text>
      <TouchableOpacity onPress={toggleTheme}>
        <Text>切换主题</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### useThemeManager (高级 Hook)
提供完整的主题管理功能，包括状态监控和高级操作。

```tsx
import { useThemeManager } from './src/theme/ThemeContext';

function AdvancedThemeComponent() {
  const {
    theme,
    themeMode,
    isDark,
    isTransitioning,
    switchToLightMode,
    switchToDarkMode,
    switchToSystemMode,
    getThemeStatus,
    getAvailableThemes,
    canSwitchTheme
  } = useThemeManager();
  
  const handleThemeSwitch = (mode) => {
    if (canSwitchTheme()) {
      switch (mode) {
        case 'light':
          switchToLightMode();
          break;
        case 'dark':
          switchToDarkMode();
          break;
        case 'system':
          switchToSystemMode();
          break;
      }
    }
  };
  
  return (
    <View>
      {getAvailableThemes().map(themeConfig => (
        <TouchableOpacity
          key={themeConfig.mode}
          onPress={() => handleThemeSwitch(themeConfig.mode)}
          disabled={isTransitioning}
        >
          <Text>{themeConfig.icon} {themeConfig.displayName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

### useSimpleTheme (简化 Hook)
只提供基本主题信息，适合简单组件使用。

```tsx
import { useSimpleTheme } from './src/theme/ThemeContext';

function SimpleComponent() {
  const { theme, isDark, colors, spacing } = useSimpleTheme();
  
  return (
    <View style={{
      backgroundColor: colors.background,
      padding: spacing.md
    }}>
      <Text style={{ color: colors.text }}>简单组件</Text>
    </View>
  );
}
```

### useThemeStyles (样式 Hook)
提供样式相关的辅助功能。

```tsx
import { useThemeStyles } from './src/theme/ThemeContext';

function StyledComponent() {
  const { addOpacity, createStyles } = useThemeStyles();
  
  const styles = createStyles((theme) => ({
    container: {
      backgroundColor: addOpacity(theme.colors.primary, 0.1),
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
    },
    text: {
      color: theme.colors.text,
      fontSize: 16,
    }
  }));
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>样式化组件</Text>
    </View>
  );
}
```

## 工具函数

### ThemeUtils
提供主题相关的实用工具函数。

```tsx
import { ThemeUtils } from './src/theme/ThemeContext';

// 获取主题模式显示名称
const displayName = ThemeUtils.getThemeModeDisplayName(ThemeMode.DARK); // "暗色模式"

// 获取主题模式图标
const icon = ThemeUtils.getThemeModeIcon(ThemeMode.LIGHT); // "🌞"

// 添加透明度到颜色
const transparentColor = ThemeUtils.addOpacityToColor('#FF0000', 0.5); // "rgba(255, 0, 0, 0.5)"

// 获取下一个主题模式
const nextMode = ThemeUtils.getNextThemeMode(ThemeMode.LIGHT); // ThemeMode.DARK
```

## 最佳实践

### 1. 组件中使用主题
```tsx
// ✅ 推荐：使用 useMemo 优化样式创建
const MyComponent = () => {
  const { theme } = useTheme();
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
    },
    text: {
      color: theme.colors.text,
      fontSize: 16,
    }
  }), [theme]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>内容</Text>
    </View>
  );
};
```

### 2. 条件样式
```tsx
// ✅ 推荐：基于主题状态的条件样式
const ConditionalComponent = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <View style={[
      { backgroundColor: theme.colors.surface },
      isDark && { borderColor: theme.colors.primary }
    ]}>
      <Text>条件样式内容</Text>
    </View>
  );
};
```

### 3. 主题切换动画
```tsx
// ✅ 推荐：带动画的主题切换
const AnimatedThemeButton = () => {
  const { toggleTheme, isTransitioning } = useThemeManager();
  const [animationValue] = useState(new Animated.Value(1));
  
  const handlePress = () => {
    if (!isTransitioning) {
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
      
      toggleTheme();
    }
  };
  
  return (
    <Animated.View style={{ transform: [{ scale: animationValue }] }}>
      <TouchableOpacity onPress={handlePress} disabled={isTransitioning}>
        <Text>切换主题</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
```

## 注意事项

1. **性能优化**: 使用 `useMemo` 和 `useCallback` 优化样式和函数创建
2. **避免频繁切换**: 使用内置的防抖机制，避免用户频繁切换主题
3. **错误处理**: 主题系统包含错误处理，但建议在关键位置添加额外的错误边界
4. **测试**: 确保在不同主题模式下测试应用的所有功能

## 迁移指南

如果您正在从旧版本的主题系统迁移，请注意以下变化：

1. `toggleTheme` 现在在三种模式间循环切换
2. 新增了 `setThemeMode` 方法用于直接设置主题模式
3. 新增了 `isSystemFollowing` 属性表示是否跟随系统
4. 主题设置现在会自动持久化存储

## 故障排除

### 主题不生效
- 确保组件被 `ThemeProvider` 包裹
- 检查是否正确导入了主题相关的 Hook

### 系统主题跟随不工作
- 确保设备支持系统主题切换
- 检查应用权限设置

### 主题设置不保存
- 确保已安装 `@react-native-async-storage/async-storage`
- 检查存储权限

更多问题请查看项目的 Issues 页面或联系开发团队。