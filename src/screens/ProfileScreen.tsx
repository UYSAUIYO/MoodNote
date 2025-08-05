import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Switch,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface ProfileScreenProps {
  onLogout?: () => void;
  onNavigateToSettings?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout, onNavigateToSettings }) => {
  const { theme, toggleTheme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      '确认登出',
      '你确定要登出吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            if (onLogout) {
              onLogout();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleAbout = () => {
    Alert.alert(
      '关于心情笔记',
      '心情笔记 v1.0.0\n\n一个简单而优雅的心情记录应用，帮助你更好地了解自己的情绪变化。\n\n© 2024 心情笔记团队',
      [{ text: '确定' }]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      '意见反馈',
      '感谢你的反馈！请通过以下方式联系我们：\n\n邮箱: feedback@moodnote.com\n微信: MoodNoteApp',
      [{ text: '确定' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      '隐私政策',
      '我们非常重视你的隐私。所有心情数据都存储在本地设备上，不会上传到服务器。',
      [{ text: '确定' }]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    header: {
      marginTop: 25,
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    avatarText: {
      fontSize: 32,
      color: theme.colors.surface,
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    userInfo: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    menuItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuIcon: {
      fontSize: 20,
      marginRight: theme.spacing.md,
      width: 24,
      textAlign: 'center',
    },
    menuText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    menuArrow: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logoutButton: {
      backgroundColor: '#FF6B6B',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    statsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.inputBorder,
      marginVertical: theme.spacing.lg,
      marginHorizontal: theme.spacing.md,
    },
    footerInfo: {
      alignItems: 'center',
      paddingBottom: 50,
    },
    icpText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    authorLink: {
      fontSize: 12,
      color: theme.colors.primary,
      textDecorationLine: 'underline',
      textAlign: 'center',
    },
    settingsButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 8,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 1000,
    },
    settingsButtonText: {
      fontSize: 18,
      color: theme.colors.text,
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* 右上角设置按钮 */}
      {onNavigateToSettings && (
        <TouchableOpacity style={styles.settingsButton} onPress={onNavigateToSettings}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      )}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.username}>心情记录者</Text>
          <Text style={styles.userInfo}>已使用 42 天</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>记录天数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>连续天数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>获得成就</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设置</Text>

          <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{theme.isDark ? '🌙' : '☀️'}</Text>
              <Text style={styles.menuText}>主题模式</Text>
            </View>
            <Text style={styles.menuArrow}>{theme.isDark ? '深色' : '浅色'}</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={styles.menuText}>推送通知</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.inputBorder, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>⏰</Text>
              <Text style={styles.menuText}>每日提醒</Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: theme.colors.inputBorder, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>帮助与支持</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleFeedback}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>💬</Text>
              <Text style={styles.menuText}>意见反馈</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacy}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🔒</Text>
              <Text style={styles.menuText}>隐私政策</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>ℹ️</Text>
              <Text style={styles.menuText}>关于我们</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        {/* 分割线 */}
        <View style={styles.divider} />

        {/* 底部信息 */}
        <View style={styles.footerInfo}>
          <Text style={styles.icpText}>ICP备案号：京ICP备2024000001号</Text>
          <TouchableOpacity onPress={() => Alert.alert('作者信息', '开发者：心情笔记团队\n联系方式：dev@moodnote.com')}>
            <Text style={styles.authorLink}>关于作者</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default ProfileScreen;