import React, { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
}

interface MoodPickerProps {
  visible: boolean;
  onMoodSelect: (mood: MoodOption) => void;
  onClose: () => void;
  selectedMood?: MoodOption | null;
  moodOptions: MoodOption[];
}

const MoodPicker: React.FC<MoodPickerProps> = ({ 
  visible, 
  onMoodSelect, 
  onClose, 
  selectedMood,
  moodOptions 
}) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // 动画效果
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  
  const styles = useMemo(() => StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
    },
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: height * 0.6,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.inputBorder,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.textSecondary + '20',
    },
    closeButtonText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    moodContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    moodGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    moodOption: {
      width: '30%',
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    moodOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    moodEmoji: {
      fontSize: 32,
      marginBottom: theme.spacing.xs,
    },
    moodLabel: {
      fontSize: 12,
      color: theme.colors.text,
      fontWeight: '500',
      textAlign: 'center',
    },
    moodLabelSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  }), [theme, width, height]);
  
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.6, 0],
  });
  
  if (!visible) {
    return null;
  }
  
  return (
    <>
      <Animated.View 
        style={[styles.overlay, { opacity: opacityAnim }]}
      >
        <TouchableOpacity 
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            opacity: opacityAnim,
          }
        ]}
      >
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.title}>选择心情</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        {/* 心情网格 */}
        <ScrollView 
          style={styles.moodContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        >
          <View style={styles.moodGrid}>
            {moodOptions.map((mood, index) => {
              const isSelected = selectedMood?.emoji === mood.emoji;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.moodOption,
                    isSelected && styles.moodOptionSelected,
                    { backgroundColor: isSelected ? mood.color + '20' : theme.colors.background }
                  ]}
                  onPress={() => onMoodSelect(mood)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[
                    styles.moodLabel,
                    isSelected && styles.moodLabelSelected
                  ]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
};

export default MoodPicker;
export type { MoodOption };