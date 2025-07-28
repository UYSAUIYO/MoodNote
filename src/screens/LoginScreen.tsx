import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface LoginScreenProps {
  onNavigateToRegister?: () => void;
  onLoginSuccess?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister, onLoginSuccess }) => {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const usernameInputScale = useRef(new Animated.Value(1)).current;
  const passwordInputScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // 页面加载动画
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 按钮按压动画
  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // 输入框聚焦动画
  const handleInputFocus = (inputScale: Animated.Value) => {
    Animated.spring(inputScale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = (inputScale: Animated.Value) => {
    Animated.spring(inputScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // 错误震动动画
  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      triggerShakeAnimation();
      Alert.alert('错误', '请输入用户名和密码');
      return;
    }

    setIsLoading(true);

    // 模拟登录请求
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('成功', '登录成功！', [
        {
          text: '确定',
          onPress: () => {
            if (onLoginSuccess) {
              onLoginSuccess();
            }
          },
        },
      ]);
    }, 1500);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      justifyContent: 'center',
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 48,
    },
    title: {
      fontSize: 36,
      fontWeight: '800',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textShadowColor: theme.isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontWeight: '300',
    },
    formContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    inputContainer: {
      marginBottom: theme.spacing.lg,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      marginLeft: 4,
    },
    input: {
      height: 56,
      borderWidth: 0,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: 20,
      fontSize: 16,
      backgroundColor: theme.colors.inputBackground,
      color: theme.colors.text,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    loginButton: {
      height: 56,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.md,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
    loginButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      shadowOpacity: 0.1,
      elevation: 3,
    },
    loginButtonText: {
      color: theme.colors.buttonText,
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    forgotPasswordButton: {
      alignItems: 'center',
      marginTop: 20,
      paddingVertical: 8,
    },
    forgotPasswordText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '500',
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
    },
    registerText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      fontWeight: '400',
    },
    registerLink: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '700',
      marginLeft: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* 应用标题 */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>MoodNote</Text>
            <Text style={styles.subtitle}>记录你的每一份心情</Text>
          </View>

          {/* 登录表单 */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                transform: [{ translateX: shakeAnim }],
              },
            ]}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>用户名</Text>
              <Animated.View
                style={{
                  transform: [{ scale: usernameInputScale }],
                }}
              >
                <TextInput
                  style={styles.input}
                  placeholder="请输入用户名"
                  placeholderTextColor={theme.colors.placeholder}
                  value={username}
                  onChangeText={setUsername}
                  onFocus={() => handleInputFocus(usernameInputScale)}
                  onBlur={() => handleInputBlur(usernameInputScale)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </Animated.View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>密码</Text>
              <Animated.View
                style={{
                  transform: [{ scale: passwordInputScale }],
                }}
              >
                <TextInput
                  style={styles.input}
                  placeholder="请输入密码"
                  placeholderTextColor={theme.colors.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => handleInputFocus(passwordInputScale)}
                  onBlur={() => handleInputBlur(passwordInputScale)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </Animated.View>
            </View>

            <Animated.View
              style={{
                transform: [{ scale: buttonScale }],
              }}
            >
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                onPressIn={handleButtonPressIn}
                onPressOut={handleButtonPressOut}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? '登录中...' : '登录'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>忘记密码？</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 注册链接 */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>还没有账号？</Text>
            <TouchableOpacity onPress={onNavigateToRegister}>
              <Text style={styles.registerLink}>立即注册</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;