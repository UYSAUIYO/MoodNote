/**
 * MoodNote App
 * 心情记录应用
 *
 * @format
 */

import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import StatsScreen from './src/screens/StatsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DiaryListScreen from './src/screens/DiaryListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileEditScreen from './src/screens/ProfileEditScreen';
import BottomTabNavigator from './src/components/BottomTabNavigator';
import SplashScreen from './src/components/SplashScreen';

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'home' | 'diaryList' | 'settings' | 'profileEdit'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    mainContent: {
      flex: 1,
    },
    themeToggle: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 1000,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    themeToggleText: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: '600',
    },
    debugButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 1000,
      backgroundColor: theme.colors.accent,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    debugButtonText: {
      color: theme.colors.buttonText,
      fontSize: 12,
      fontWeight: '600',
    },
  }), [theme]);

  // 跳过登录（调试用）
  const handleSkipLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  // 登出
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  // 登录成功
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
    setActiveTab('home');
  };

  // 底部导航栏切换
  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  // 导航到日记列表
  const handleNavigateToDiaryList = () => {
    setCurrentScreen('diaryList');
  };

  // 从日记列表返回
  const handleGoBackFromDiaryList = () => {
    setCurrentScreen('home');
  };

  // 导航到设置页面
  const handleNavigateToSettings = () => {
    setCurrentScreen('settings');
  };

  // 从设置页面返回
  const handleGoBackFromSettings = () => {
    setCurrentScreen('home');
    setActiveTab('profile');
  };

  // 导航到账号资料编辑页面
  const handleNavigateToProfileEdit = () => {
    setCurrentScreen('profileEdit');
  };

  // 从账号资料编辑页面返回
  const handleGoBackFromProfileEdit = () => {
    setCurrentScreen('settings');
  };

  // 渲染当前活跃的标签页内容
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onLogout={handleLogout} onNavigateToDiaryList={handleNavigateToDiaryList} />;
      case 'stats':
        return <StatsScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'profile':
        return <ProfileScreen onLogout={handleLogout} onNavigateToSettings={handleNavigateToSettings} />;
      default:
        return <HomeScreen onLogout={handleLogout} onNavigateToDiaryList={handleNavigateToDiaryList} />;
    }
  };

  // 如果显示启动动画，直接返回启动动画组件
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      {/* 主题切换按钮 - 只在登录和注册界面显示 */}
      {!isLoggedIn && (
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Text style={styles.themeToggleText}>
            {theme.isDark ? '🌞 亮色' : '🌙 暗色'}
          </Text>
        </TouchableOpacity>
      )}

      {/* 跳过登录按钮（仅在未登录时显示） */}
      {!isLoggedIn && (
        <TouchableOpacity style={styles.debugButton} onPress={handleSkipLogin}>
          <Text style={styles.debugButtonText}>🚀 跳过登录</Text>
        </TouchableOpacity>
      )}

      {/* 根据登录状态和当前屏幕显示不同组件 */}
      {isLoggedIn ? (
        currentScreen === 'diaryList' ? (
          <DiaryListScreen onGoBack={handleGoBackFromDiaryList} />
        ) : currentScreen === 'settings' ? (
          <SettingsScreen 
            onGoBack={handleGoBackFromSettings} 
            onNavigateToProfile={handleNavigateToProfileEdit}
          />
        ) : currentScreen === 'profileEdit' ? (
          <ProfileEditScreen onGoBack={handleGoBackFromProfileEdit} />
        ) : (
          <>
            <View style={styles.mainContent}>
              {renderActiveTabContent()}
            </View>
            <BottomTabNavigator
              activeTab={activeTab}
              onTabPress={handleTabPress}
            />
          </>
        )
      ) : currentScreen === 'login' ? (
        <LoginScreen 
          onNavigateToRegister={() => setCurrentScreen('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <RegisterScreen 
          onNavigateToLogin={() => setCurrentScreen('login')}
          onRegisterSuccess={handleLoginSuccess}
        />
      )}
    </SafeAreaView>
  );
};

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
