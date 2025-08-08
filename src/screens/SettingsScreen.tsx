/**
 * 账号设置页面
 * 包含账号设置、安全设置、数据管理等功能
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Switch,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { BackIcon, SaveIcon, ProfileIcon, CloudIcon } from '../components/Icons';

interface SettingsScreenProps {
  onGoBack: () => void;
  onNavigateToProfile: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onGoBack, onNavigateToProfile }) => {
  const { theme, toggleTheme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  // 账号信息状态
  const [email, setEmail] = useState('user@moodnote.com');
  const [phone, setPhone] = useState('138****8888');
  
  // 设置状态
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

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

  const handleSaveSettings = () => {
    Alert.alert('保存成功', '账号设置已更新');
  };

  const handleChangePassword = () => {
    Alert.alert('修改密码', '请前往邮箱验证后修改密码');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '删除账号',
      '此操作不可逆，将永久删除您的所有数据。确定要继续吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定删除', 
          style: 'destructive',
          onPress: () => Alert.alert('账号删除', '账号删除功能暂未开放')
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('导出数据', '数据导出功能开发中，敬请期待');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      marginTop: 35,
      borderBottomColor: theme.colors.inputBorder,
    },
    backButton: {
      padding: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    saveButton: {
      padding: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    inputGroup: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    menuItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuIcon: {
      fontSize: 20,
      marginRight: theme.spacing.md,
      width: 24,
      textAlign: 'center',
    },
    menuIconContainer: {
      marginRight: theme.spacing.md,
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    menuArrow: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    dangerButton: {
      backgroundColor: '#FF6B6B',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    dangerButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
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
      {/* 头部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <BackIcon size={20} color={theme.colors.text} />
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>账号设置</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
          <SaveIcon size={20} color={theme.colors.primary} />
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 账号资料 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>账号资料</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={onNavigateToProfile}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <ProfileIcon size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.menuText}>编辑个人资料</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 账号信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>账号信息</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>邮箱</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="请输入邮箱"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>手机号</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="请输入手机号"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* 账号安全 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>账号安全</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🔑</Text>
              <Text style={styles.menuText}>修改密码</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>👆</Text>
              <Text style={styles.menuText}>生物识别登录</Text>
            </View>
            <Switch
              value={biometricAuth}
              onValueChange={setBiometricAuth}
              trackColor={{ false: theme.colors.inputBorder, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🔐</Text>
              <Text style={styles.menuText}>双重验证</Text>
            </View>
            <Switch
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              trackColor={{ false: theme.colors.inputBorder, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
        </View>

        {/* 数据管理 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据管理</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <CloudIcon size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.menuText}>自动备份</Text>
            </View>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: theme.colors.inputBorder, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🔄</Text>
              <Text style={styles.menuText}>数据同步</Text>
            </View>
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
              trackColor={{ false: theme.colors.inputBorder, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleExportData}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>📤</Text>
              <Text style={styles.menuText}>导出数据</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 危险操作 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>危险操作</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
            <Text style={styles.dangerButtonText}>删除账号</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default SettingsScreen;