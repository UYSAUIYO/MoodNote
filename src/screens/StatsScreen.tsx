import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

const StatsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

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

  // 模拟统计数据
  const stats = {
    totalEntries: 42,
    currentStreak: 7,
    longestStreak: 15,
    averageMood: 4.2,
    moodDistribution: {
      '😄': 25,
      '😊': 30,
      '😐': 20,
      '😔': 15,
      '😢': 10,
    },
  };

  const moodEmojis = ['😢', '😔', '😐', '😊', '😄'];
  const moodLabels = ['很糟糕', '不太好', '一般', '不错', '很棒'];

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
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    statCard: {
      width: (width - theme.spacing.lg * 3) / 2,
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
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    chartContainer: {
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
    chartTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    moodBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    moodEmoji: {
      fontSize: 20,
      width: 30,
    },
    moodLabel: {
      fontSize: 14,
      color: theme.colors.text,
      width: 60,
      marginRight: theme.spacing.sm,
    },
    barContainer: {
      flex: 1,
      height: 20,
      backgroundColor: theme.colors.inputBorder,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
    },
    bar: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
    },
    barValue: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      width: 30,
      textAlign: 'right',
    },
    averageMoodContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    averageMoodTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    averageMoodValue: {
      fontSize: 36,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    averageMoodEmoji: {
      fontSize: 48,
    },
  });

  const getAverageMoodEmoji = (average: number) => {
    const index = Math.round(average) - 1;
    return moodEmojis[Math.max(0, Math.min(4, index))];
  };

  const maxMoodCount = Math.max(...Object.values(stats.moodDistribution));

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
          <Text style={styles.title}>心情统计</Text>
          <Text style={styles.subtitle}>了解你的心情变化趋势</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalEntries}</Text>
            <Text style={styles.statLabel}>总记录数</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>连续记录天数</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>最长连续记录</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.averageMood.toFixed(1)}</Text>
            <Text style={styles.statLabel}>平均心情评分</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>心情分布</Text>
          {Object.entries(stats.moodDistribution).map(([emoji, count], index) => (
            <View key={emoji} style={styles.moodBar}>
              <Text style={styles.moodEmoji}>{emoji}</Text>
              <Text style={styles.moodLabel}>{moodLabels[index]}</Text>
              <View style={styles.barContainer}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      width: `${(count / maxMoodCount) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>{count}</Text>
            </View>
          ))}
        </View>

        <View style={styles.averageMoodContainer}>
          <Text style={styles.averageMoodTitle}>平均心情</Text>
          <Text style={styles.averageMoodValue}>{stats.averageMood.toFixed(1)}</Text>
          <Text style={styles.averageMoodEmoji}>
            {getAverageMoodEmoji(stats.averageMood)}
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default StatsScreen;