import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedDate?: string;
}

const AchievementsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const achievements: Achievement[] = [
    {
      id: '1',
      title: '初次记录',
      description: '完成第一次心情记录',
      icon: '🌟',
      unlocked: true,
      unlockedDate: '2024-01-15',
    },
    {
      id: '2',
      title: '连续一周',
      description: '连续7天记录心情',
      icon: '🔥',
      unlocked: true,
      unlockedDate: '2024-01-22',
    },
    {
      id: '3',
      title: '心情达人',
      description: '累计记录50次心情',
      icon: '📝',
      unlocked: false,
      progress: 42,
      maxProgress: 50,
    },
    {
      id: '4',
      title: '阳光心态',
      description: '连续10天记录积极心情',
      icon: '☀️',
      unlocked: false,
      progress: 6,
      maxProgress: 10,
    },
    {
      id: '5',
      title: '月度坚持',
      description: '连续30天记录心情',
      icon: '📅',
      unlocked: false,
      progress: 15,
      maxProgress: 30,
    },
    {
      id: '6',
      title: '情绪管理师',
      description: '使用所有心情类型',
      icon: '🎭',
      unlocked: true,
      unlockedDate: '2024-01-20',
    },
    {
      id: '7',
      title: '早起鸟儿',
      description: '在早上6点前记录心情10次',
      icon: '🐦',
      unlocked: false,
      progress: 3,
      maxProgress: 10,
    },
    {
      id: '8',
      title: '夜猫子',
      description: '在晚上10点后记录心情10次',
      icon: '🦉',
      unlocked: false,
      progress: 7,
      maxProgress: 10,
    },
  ];

  const categories = [
    { id: 'all', label: '全部', icon: '🏆' },
    { id: 'unlocked', label: '已获得', icon: '✅' },
    { id: 'locked', label: '未获得', icon: '🔒' },
  ];

  const filteredAchievements = achievements.filter((achievement) => {
    if (selectedCategory === 'unlocked') return achievement.unlocked;
    if (selectedCategory === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    header: {
      marginTop: 10,
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    progressContainer: {
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
    progressTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    progressText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    categoryContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
    },
    categoryButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
    },
    activeCategoryButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryIcon: {
      fontSize: 20,
      marginBottom: 4,
    },
    categoryText: {
      fontSize: 12,
      color: theme.colors.text,
      fontWeight: '500',
    },
    activeCategoryText: {
      color: theme.colors.surface,
    },
    achievementCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lockedCard: {
      opacity: 0.6,
    },
    achievementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    achievementIcon: {
      fontSize: 32,
      marginRight: theme.spacing.md,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    achievementDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    achievementBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    badgeText: {
      fontSize: 10,
      color: theme.colors.surface,
      fontWeight: '600',
    },
    progressBar: {
      marginTop: theme.spacing.sm,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: theme.colors.inputBorder,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
    unlockedDate: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
      fontStyle: 'italic',
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
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>成就系统</Text>
          <Text style={styles.subtitle}>记录你的每一个里程碑</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>总体进度</Text>
          <Text style={styles.progressText}>
            {unlockedCount} / {totalCount}
          </Text>
        </View>

        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.activeCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.activeCategoryText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredAchievements.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCard,
              !achievement.unlocked && styles.lockedCard,
            ]}
          >
            <View style={styles.achievementHeader}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
              {achievement.unlocked && (
                <View style={styles.achievementBadge}>
                  <Text style={styles.badgeText}>已获得</Text>
                </View>
              )}
            </View>

            {!achievement.unlocked && achievement.progress !== undefined && (
              <View style={styles.progressBar}>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${(achievement.progress! / achievement.maxProgress!) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {achievement.progress} / {achievement.maxProgress}
                </Text>
              </View>
            )}

            {achievement.unlocked && achievement.unlockedDate && (
              <Text style={styles.unlockedDate}>
                获得时间: {achievement.unlockedDate}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

export default AchievementsScreen;