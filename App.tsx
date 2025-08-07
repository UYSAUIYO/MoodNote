/**
 * MoodNote App
 * 心情记录应用
 *
 * @format
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  ToastAndroid,
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
import WriteDiaryScreen from './src/screens/WriteDiaryScreen';
import BottomTabNavigator from './src/components/BottomTabNavigator';
import SplashScreen from './src/components/SplashScreen';

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'home' | 'diaryList' | 'settings' | 'profileEdit' | 'writeDiary'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [backPressCount, setBackPressCount] = useState(0);
  const backPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // 处理Android返回键
  const handleBackPress = () => {
    // 如果在启动页面，不处理返回键
    if (showSplash) {
      return false;
    }

    // 如果未登录，在登录和注册页面之间切换
    if (!isLoggedIn) {
      if (currentScreen === 'register') {
        setCurrentScreen('login');
        return true;
      }
      // 在登录页面，显示退出确认
      Alert.alert(
        '退出应用',
        '确定要退出应用吗？',
        [
          { text: '取消', style: 'cancel' },
          { text: '确定', onPress: () => BackHandler.exitApp() }
        ]
      );
      return true;
    }

    // 已登录状态下的返回逻辑
    if (currentScreen === 'profileEdit') {
      // 二级页面：账号资料编辑 -> 设置页面
      setCurrentScreen('settings');
      return true;
    } else if (currentScreen === 'writeDiary') {
      // 二级页面：写日记 -> 日记列表
      setCurrentScreen('diaryList');
      return true;
    } else if (currentScreen === 'settings' || currentScreen === 'diaryList') {
      // 一级页面：设置/日记列表 -> 主页
      setCurrentScreen('home');
      setActiveTab('home');
      return true;
    } else if (currentScreen === 'home') {
      // 主页：双击退出逻辑
      if (backPressCount === 0) {
        setBackPressCount(1);
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        
        // 2秒后重置计数
        if (backPressTimer.current) {
          clearTimeout(backPressTimer.current);
        }
        backPressTimer.current = setTimeout(() => {
          setBackPressCount(0);
        }, 2000);
        
        return true;
      } else {
        // 第二次按返回键，退出应用
        if (backPressTimer.current) {
          clearTimeout(backPressTimer.current);
        }
        BackHandler.exitApp();
        return true;
      }
    }

    return false;
  };

  // 监听返回键
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => {
      backHandler.remove();
      if (backPressTimer.current) {
        clearTimeout(backPressTimer.current);
      }
    };
  }, [showSplash, isLoggedIn, currentScreen, backPressCount]);

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
    // 临时写日记页面样式
    tempScreen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
    },
    tempScreenText: {
      fontSize: 18,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    tempBackButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    tempBackButtonText: {
      color: theme.colors.buttonText,
      fontSize: 16,
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

  // 导航到写日记页面
  const handleNavigateToWriteDiary = () => {
    setCurrentScreen('writeDiary');
  };

  // 从写日记页面返回
  const handleGoBackFromWriteDiary = () => {
    setCurrentScreen('diaryList');
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
          <DiaryListScreen 
            onGoBack={handleGoBackFromDiaryList} 
            onWriteDiary={handleNavigateToWriteDiary}
          />
        ) : currentScreen === 'settings' ? (
          <SettingsScreen 
            onGoBack={handleGoBackFromSettings} 
            onNavigateToProfile={handleNavigateToProfileEdit}
          />
        ) : currentScreen === 'profileEdit' ? (
          <ProfileEditScreen onGoBack={handleGoBackFromProfileEdit} />
        ) : currentScreen === 'writeDiary' ? (
          <WriteDiaryScreen 
            onGoBack={handleGoBackFromWriteDiary}
            onSave={(diaryData) => {
              // 这里可以添加保存日记的逻辑
              console.log('保存日记:', diaryData);
            }}
          />
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
