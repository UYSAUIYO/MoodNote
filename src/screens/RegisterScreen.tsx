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
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface RegisterScreenProps {
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin, onRegisterSuccess }) => {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const usernameInputScale = useRef(new Animated.Value(1)).current;
  const emailInputScale = useRef(new Animated.Value(1)).current;
  const passwordInputScale = useRef(new Animated.Value(1)).current;
  const confirmPasswordInputScale = useRef(new Animated.Value(1)).current;
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

  // 验证邮箱格式
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      triggerShakeAnimation();
      Alert.alert('错误', '请填写所有字段');
      return;
    }

    if (!validateEmail(email)) {
      triggerShakeAnimation();
      Alert.alert('错误', '请输入有效的邮箱地址');
      return;
    }

    if (password !== confirmPassword) {
      triggerShakeAnimation();
      Alert.alert('错误', '两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      triggerShakeAnimation();
      Alert.alert('错误', '密码长度至少为6位');
      return;
    }

    setIsLoading(true);
    
    // 模拟注册请求
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('成功', '注册成功！', [
        {
          text: '确定',
          onPress: () => {
            if (onRegisterSuccess) {
              onRegisterSuccess();
            }
          },
        },
      ]);
    }, 2000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
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
    registerButton: {
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
    registerButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      shadowOpacity: 0.1,
      elevation: 3,
    },
    registerButtonText: {
      color: theme.colors.buttonText,
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    loginContainer: {
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
    loginText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      fontWeight: '400',
    },
    loginLink: {
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
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
              <Text style={styles.title}>创建账户</Text>
              <Text style={styles.subtitle}>加入MoodNote，开始记录你的心情</Text>
            </View>

            {/* 注册表单 */}
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
                <Text style={styles.inputLabel}>邮箱</Text>
                <Animated.View
                  style={{
                    transform: [{ scale: emailInputScale }],
                  }}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="请输入邮箱地址"
                    placeholderTextColor={theme.colors.placeholder}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => handleInputFocus(emailInputScale)}
                    onBlur={() => handleInputBlur(emailInputScale)}
                    keyboardType="email-address"
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
                    placeholder="请输入密码（至少6位）"
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

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>确认密码</Text>
                <Animated.View
                  style={{
                    transform: [{ scale: confirmPasswordInputScale }],
                  }}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="请再次输入密码"
                    placeholderTextColor={theme.colors.placeholder}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => handleInputFocus(confirmPasswordInputScale)}
                    onBlur={() => handleInputBlur(confirmPasswordInputScale)}
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
                  style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                  onPress={handleRegister}
                  onPressIn={handleButtonPressIn}
                  onPressOut={handleButtonPressOut}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.registerButtonText}>
                    {isLoading ? '注册中...' : '注册'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            {/* 登录链接 */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>已有账号？</Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text style={styles.loginLink}>立即登录</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;