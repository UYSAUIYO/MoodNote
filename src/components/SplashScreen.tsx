/**
 * 启动动画组件
 * 显示应用logo和加载动画，3秒后自动进入主应用
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // 启动动画序列
    const animationSequence = Animated.sequence([
      // 第一阶段：淡入和缩放
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // 第二阶段：保持显示3秒
      Animated.delay(3000),
    ]);

    animationSequence.start(() => {
      // 动画完成后调用回调
      onFinish();
    });

    return () => {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
    };
  }, [fadeAnim, scaleAnim, onFinish]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoIcon: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    logoText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    appName: {
      fontSize: 28,
      fontWeight: '600',
      color: theme.colors.surface,
      marginBottom: 8,
      letterSpacing: 2,
    },
    tagline: {
      fontSize: 16,
      color: theme.colors.surface,
      opacity: 0.8,
      textAlign: 'center',
      marginBottom: 40,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    loadingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.surface,
      marginHorizontal: 4,
    },
    loadingText: {
      fontSize: 14,
      color: theme.colors.surface,
      opacity: 0.7,
      marginTop: 20,
    },
    skipButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    skipButtonText: {
      color: theme.colors.surface,
      fontSize: 14,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
        translucent={false}
      />
      
      {/* 跳过按钮 */}
      <TouchableOpacity style={styles.skipButton} onPress={onFinish}>
        <Text style={styles.skipButtonText}>跳过</Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>📝</Text>
        </View>
        
        <Text style={styles.appName}>MoodNote</Text>
        <Text style={styles.tagline}>记录每一刻心情</Text>
        
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
        </View>
        
        <Text style={styles.loadingText}>正在加载...</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;