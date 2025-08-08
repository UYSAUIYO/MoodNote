import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
          <View style={styles.iconContainer}>
            <IconComponent 
              size={24} 
              color={isActive ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.label,
              activeTab === tab.id && styles.activeLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabNavigator;