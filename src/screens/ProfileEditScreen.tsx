/**
 * 账号资料编辑页面
 * 包含头像、昵称、出生年月、个性签名、学校等信息的编辑
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
  Image,
  Modal,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import DatePicker from '../components/DatePicker';
import UniversitySearch from '../components/UniversitySearch';

interface ProfileEditScreenProps {
  onGoBack: () => void;
}

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({ onGoBack }) => {
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  // 个人资料状态
  const [avatar, setAvatar] = useState('https://via.placeholder.com/100');
  const [nickname, setNickname] = useState('您还未设置昵称');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [signature, setSignature] = useState('');
  const [university, setUniversity] = useState('');
  const [uid] = useState('20240101001'); // UID为只读，注册时生成
  
  // 模态框状态
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUniversitySearch, setShowUniversitySearch] = useState(false);

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

  const handleSaveProfile = () => {
    Alert.alert('保存成功', '个人资料已更新');
  };

  const handleAvatarPress = () => {
    Alert.alert(
      '更换头像',
      '请选择头像来源',
      [
        { text: '取消', style: 'cancel' },
        { text: '拍照', onPress: () => Alert.alert('提示', '拍照功能开发中') },
        { text: '相册', onPress: () => Alert.alert('提示', '相册功能开发中') },
      ]
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '请选择出生日期';
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
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
    },
    backButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    saveButton: {
      padding: theme.spacing.sm,
    },
    saveButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.surface,
    },
    avatarEditButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.primary,
      borderRadius: 15,
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarEditText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    uidText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
    },
    inputGroup: {
      marginBottom: theme.spacing.lg,
    },
    inputLabel: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: '500',
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
    selectButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    selectButtonText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    selectButtonArrow: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    placeholderText: {
      color: theme.colors.textSecondary,
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
          <Text style={styles.backButtonText}>‹ 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>账号资料</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 头像区域 */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={styles.avatarEditButton}>
              <Text style={styles.avatarEditText}>✎</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.uidText}>UID: {uid}</Text>
        </View>

        {/* 昵称 */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>昵称</Text>
          <TextInput
            style={styles.textInput}
            value={nickname}
            onChangeText={setNickname}
            placeholder="请输入昵称"
            placeholderTextColor={theme.colors.textSecondary}
            maxLength={20}
          />
        </View>

        {/* 出生日期 */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>出生日期</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.selectButtonText, !birthDate && styles.placeholderText]}>
              {formatDate(birthDate)}
            </Text>
            <Text style={styles.selectButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 个性签名 */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>个性签名</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={signature}
            onChangeText={setSignature}
            placeholder="写下你的个性签名吧"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            maxLength={100}
          />
        </View>

        {/* 学校 */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>学校</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowUniversitySearch(true)}
          >
            <Text style={[styles.selectButtonText, !university && styles.placeholderText]}>
              {university || '请选择学校'}
            </Text>
            <Text style={styles.selectButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 日期选择器 */}
      <DatePicker
        visible={showDatePicker}
        date={birthDate || new Date(1995, 0, 1)}
        onDateChange={setBirthDate}
        onClose={() => setShowDatePicker(false)}
      />

      {/* 大学搜索 */}
      <UniversitySearch
        visible={showUniversitySearch}
        selectedUniversity={university}
        onUniversitySelect={setUniversity}
        onClose={() => setShowUniversitySearch(false)}
      />
    </Animated.View>
  );
};

export default ProfileEditScreen;