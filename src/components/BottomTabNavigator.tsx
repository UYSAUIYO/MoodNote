import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { HomeIcon, StatsIcon, AchievementIcon, ProfileIcon } from './Icons';

interface BottomTabNavigatorProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({
  activeTab,
  onTabPress,
}) => {
  const { theme } = useTheme();
  const [animatedValues] = React.useState(() => {
    const values: { [key: string]: Animated.Value } = {};
    ['home', 'stats', 'achievements', 'profile'].forEach(tab => {
      values[tab] = new Animated.Value(0);
    });
    return values;
  });

  React.useEffect(() => {
    // 重置所有动画值
    Object.keys(animatedValues).forEach(tab => {
      Animated.timing(animatedValues[tab], {
        toValue: tab === activeTab ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab, animatedValues]);

  const tabs = [
    { id: 'home', label: '主页', IconComponent: HomeIcon },
    { id: 'stats', label: '统计', IconComponent: StatsIcon },
    { id: 'achievements', label: '成就', IconComponent: AchievementIcon },
    { id: 'profile', label: '我的', IconComponent: ProfileIcon },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.inputBorder,
      paddingBottom: 20,
      paddingTop: 10,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 8,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    activeTab: {
      backgroundColor: theme.colors.primary + '20',
      borderRadius: theme.borderRadius.md,
      marginHorizontal: 4,
    },
    iconContainer: {
      marginBottom: 4,
    },
    label: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.text,
    },
    activeLabel: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const { IconComponent } = tab;
        const isActive = activeTab === tab.id;
        const animatedValue = animatedValues[tab.id];
        
        const scaleAnimation = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        });
        
        const opacityAnimation = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1],
        });
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Animated.View 
              style={[
                styles.iconContainer,
                {
                  transform: [{ scale: scaleAnimation }],
                  opacity: opacityAnimation,
                }
              ]}
            >
              <IconComponent 
                size={24} 
                color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                isActive={isActive}
              />
            </Animated.View>
            <Animated.Text
              style={[
                styles.label,
                activeTab === tab.id && styles.activeLabel,
                { opacity: opacityAnimation }
              ]}
            >
              {tab.label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabNavigator;