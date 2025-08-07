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
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import DatePicker from '../components/DatePicker';
import UniversitySearch from '../components/UniversitySearch';
import CustomTextInput from '../components/CustomTextInput';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

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

  // 检查相机权限
  const checkCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: '相机权限',
            message: '需要访问相机来拍摄头像',
            buttonNeutral: '稍后询问',
            buttonNegative: '拒绝',
            buttonPositive: '允许',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS会自动处理权限
  };

  // 检查存储权限
  const checkStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: '存储权限',
            message: '需要访问存储来选择头像',
            buttonNeutral: '稍后询问',
            buttonNegative: '拒绝',
            buttonPositive: '允许',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS会自动处理权限
  };

  // 处理图片选择结果
  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorMessage) {
      if (response.errorMessage) {
        Alert.alert('错误', response.errorMessage);
      }
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      if (asset.uri) {
        setAvatar(asset.uri);
      }
    }
  };

  // 拍照
  const handleTakePhoto = async () => {
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) {
      Alert.alert('权限不足', '需要相机权限才能拍照');
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as const,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchCamera(options, handleImagePickerResponse);
  };

  // 从相册选择
  const handleSelectFromLibrary = async () => {
    const hasPermission = await checkStoragePermission();
    if (!hasPermission) {
      Alert.alert('权限不足', '需要存储权限才能访问相册');
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as const,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, handleImagePickerResponse);
  };

  const handleAvatarPress = () => {
    Alert.alert(
      '更换头像',
      '请选择头像来源',
      [
        { text: '取消', style: 'cancel' },
        { text: '拍照', onPress: handleTakePhoto },
        { text: '相册', onPress: handleSelectFromLibrary },
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
          <CustomTextInput
            label="昵称"
            value={nickname}
            onChangeText={setNickname}
            placeholder="请输入昵称"
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
          <CustomTextInput
            label="个性签名"
            value={signature}
            onChangeText={setSignature}
            placeholder="写下你的个性签名吧"
            multiline
            maxLength={100}
            style={{ minHeight: 80 }}
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