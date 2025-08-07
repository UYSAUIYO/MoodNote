import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { useTheme } from '../theme/ThemeContext';
import CustomTextInput from '../components/CustomTextInput';

const { width } = Dimensions.get('window');

interface WriteDiaryScreenProps {
  onGoBack: () => void;
  onSave?: (diaryData: any) => void;
}

const WriteDiaryScreen: React.FC<WriteDiaryScreenProps> = ({ onGoBack, onSave }) => {
  const { theme } = useTheme();
  
  // 状态管理
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<{emoji: string, label: string} | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showImageOptions, setShowImageOptions] = useState(false);
  
  // 引用
  const emojiButtonRef = useRef<any>(null);
  const imageButtonRef = useRef<any>(null);
  
  // 心情选项
  const moodOptions = [
    { emoji: '😊', label: '开心' },
    { emoji: '😢', label: '难过' },
    { emoji: '😤', label: '疲惫' },
    { emoji: '😌', label: '平静' },
    { emoji: '🤔', label: '思考' },
    { emoji: '💪', label: '活力' },
    { emoji: '😴', label: '困倦' },
    { emoji: '🥰', label: '幸福' },
    { emoji: '😰', label: '焦虑' },
    { emoji: '🤗', label: '温暖' },
  ];
  
  // 表情选项
  const emojiOptions = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
    '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
    '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧',
    '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓',
    '😩', '😫', '🥱', '😤', '😡', '🤬', '😠', '🤯', '😈', '👿',
    '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'
  ];
  
  // 获取当前日期
  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  };
  
  // 请求相机权限
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: '相机权限',
            message: '应用需要访问相机来拍照',
            buttonNeutral: '稍后询问',
            buttonNegative: '取消',
            buttonPositive: '确定',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  
  // 拍照功能
  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('权限不足', '需要相机权限才能拍照');
      return;
    }
    
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as any,
    };
    
    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }
      
      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setImages(prev => [...prev, imageUri]);
          setHasChanges(true);
        }
      }
    });
    
    setShowImageOptions(false);
  };
  
  // 选择图片功能
  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as any,
      selectionLimit: 5,
    };
    
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }
      
      if (response.assets) {
        const newImages = response.assets
          .map(asset => asset.uri)
          .filter((uri): uri is string => uri !== undefined);
        setImages(prev => [...prev, ...newImages]);
        setHasChanges(true);
      }
    });
    
    setShowImageOptions(false);
  };
  
  // 删除图片
  const handleRemoveImage = (imageUri: string) => {
    setImages(prev => prev.filter(uri => uri !== imageUri));
    setHasChanges(true);
  };
  
  // 插入表情到内容
  const handleInsertEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
    setHasChanges(true);
    setShowEmojiPicker(false);
  };
  
  // 处理返回
  const handleGoBack = () => {
    if (hasChanges && (title.trim() || content.trim())) {
      Alert.alert(
        '保存草稿',
        '是否保存当前内容为草稿？',
        [
          { text: '不保存', onPress: onGoBack, style: 'destructive' },
          { text: '取消', style: 'cancel' },
          { text: '保存草稿', onPress: handleSaveDraft },
        ]
      );
    } else {
      onGoBack();
    }
  };
  
  // 保存草稿
  const handleSaveDraft = () => {
    // 这里可以实现草稿保存逻辑
    Alert.alert('提示', '草稿已保存', [{ text: '确定', onPress: onGoBack }]);
  };
  
  // 保存日记
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入日记标题');
      return;
    }
    if (!content.trim()) {
      Alert.alert('提示', '请输入日记内容');
      return;
    }
    
    const diaryData = {
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood,
      tags,
      date: new Date(),
    };
    
    if (onSave) {
      onSave(diaryData);
    }
    
    Alert.alert('成功', '日记保存成功！', [{ text: '确定', onPress: onGoBack }]);
  };
  
  // 选择心情
  const handleSelectMood = (mood: {emoji: string, label: string}) => {
    setSelectedMood(mood);
    setShowMoodPicker(false);
    setHasChanges(true);
  };
  
  // 添加标签
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setHasChanges(true);
    }
    setShowTagInput(false);
  };
  
  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setHasChanges(true);
  };
  
  // 处理文本变化
  const handleTextChange = (text: string, type: 'title' | 'content') => {
    if (type === 'title') {
      setTitle(text);
    } else {
      setContent(text);
    }
    setHasChanges(true);
  };
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      marginTop: 35,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.inputBorder,
    },
    backButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.textSecondary + '20',
    },
    backButtonText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    saveButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
    },
    saveButtonText: {
      fontSize: 16,
      color: theme.colors.buttonText,
      fontWeight: '600',
    },
    dateContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
    },
    dateText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    titleInput: {
      marginTop: theme.spacing.lg,
      fontSize: 18,
      fontWeight: '600',
      minHeight: 52,
    },
    contentInput: {
      marginTop: theme.spacing.md,
      flex: 1,
      fontSize: 16,
      textAlignVertical: 'top',
      minHeight: 200,
    },
    selectedMoodContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.primary + '20',
      borderRadius: theme.borderRadius.md,
      alignSelf: 'flex-start',
    },
    selectedMoodEmoji: {
      fontSize: 20,
      marginRight: theme.spacing.xs,
    },
    selectedMoodText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.md,
    },
    tag: {
      backgroundColor: theme.colors.primary + '20',
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
      marginRight: theme.spacing.xs,
    },
    tagRemove: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    bottomToolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.inputBorder,
    },
    toolButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      marginRight: theme.spacing.sm,
      minWidth: 44,
      alignItems: 'center',
    },
    toolButtonText: {
      fontSize: 20,
    },
    // 模态框样式
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      width: width * 0.9,
      maxHeight: '70%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    moodGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    moodOption: {
      width: '30%',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
    },
    moodOptionSelected: {
      backgroundColor: theme.colors.primary + '20',
    },
    moodEmoji: {
      fontSize: 32,
      marginBottom: theme.spacing.xs,
    },
    moodLabel: {
      fontSize: 12,
      color: theme.colors.text,
      fontWeight: '500',
    },
    tagInputContainer: {
      marginTop: theme.spacing.md,
    },
    tagInput: {
      fontSize: 16,
      marginBottom: theme.spacing.md,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.lg,
    },
    modalButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    cancelButton: {
      backgroundColor: theme.colors.textSecondary + '20',
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: theme.colors.textSecondary,
    },
    confirmButtonText: {
      color: theme.colors.buttonText,
    },
    // 表情选择器样式
    emojiPickerContainer: {
      position: 'absolute',
      bottom: 80,
      left: theme.spacing.lg,
      right: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      maxHeight: 200,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    emojiGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    emojiItem: {
      width: '10%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    emojiText: {
      fontSize: 20,
    },
    // 图片相关样式
    imagesContainer: {
      marginTop: theme.spacing.md,
    },
    imagesList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    imageItem: {
      width: 80,
      height: 80,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      position: 'relative',
    },
    imagePreview: {
      width: '100%',
      height: '100%',
    },
    imageRemoveButton: {
      position: 'absolute',
      top: -5,
      right: -5,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.error || '#ff4444',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageRemoveText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    // 图片选项模态框
    imageOptionsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: width * 0.8,
    },
    imageOptionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.inputBorder,
    },
    imageOptionIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    imageOptionText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
  }), [theme]);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* 头部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
      
      {/* 日期显示 */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
      </View>
      
      {/* 主要内容区域 */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* 标题输入 */}
        <CustomTextInput
          placeholder="请输入日记标题..."
          value={title}
          onChangeText={(text) => handleTextChange(text, 'title')}
          maxLength={50}
          style={styles.titleInput}
        />
        
        {/* 内容输入 */}
        <CustomTextInput
          placeholder="记录你的心情和想法..."
          value={content}
          onChangeText={(text) => handleTextChange(text, 'content')}
          multiline
          style={styles.contentInput}
        />
        
        {/* 选中的心情显示 */}
        {selectedMood && (
          <View style={styles.selectedMoodContainer}>
            <Text style={styles.selectedMoodEmoji}>{selectedMood.emoji}</Text>
            <Text style={styles.selectedMoodText}>心情：{selectedMood.label}</Text>
          </View>
        )}
        
        {/* 标签显示 */}
        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                  <Text style={styles.tagRemove}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        {/* 图片显示 */}
        {images.length > 0 && (
          <View style={styles.imagesContainer}>
            <View style={styles.imagesList}>
              {images.map((imageUri, index) => (
                <View key={index} style={styles.imageItem}>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.imageRemoveButton}
                    onPress={() => handleRemoveImage(imageUri)}
                  >
                    <Text style={styles.imageRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* 底部工具栏 */}
      <View style={styles.bottomToolbar}>
        <TouchableOpacity 
          style={styles.toolButton} 
          onPress={() => setShowMoodPicker(true)}
        >
          <Text style={styles.toolButtonText}>😊</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          ref={emojiButtonRef}
          style={styles.toolButton}
          onPress={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Text style={styles.toolButtonText}>😀</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          ref={imageButtonRef}
          style={styles.toolButton}
          onPress={() => setShowImageOptions(true)}
        >
          <Text style={styles.toolButtonText}>🖼️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.toolButton}
          onPress={handleTakePhoto}
        >
          <Text style={styles.toolButtonText}>📷</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.toolButton} 
          onPress={() => setShowTagInput(true)}
        >
          <Text style={styles.toolButtonText}>#</Text>
        </TouchableOpacity>
      </View>
      
      {/* 心情选择模态框 */}
      <Modal
        visible={showMoodPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMoodPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>选择心情</Text>
            <ScrollView>
              <View style={styles.moodGrid}>
                {moodOptions.map((mood, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.moodOption,
                      selectedMood?.emoji === mood.emoji && styles.moodOptionSelected
                    ]}
                    onPress={() => handleSelectMood(mood)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowMoodPicker(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* 标签输入模态框 */}
      <Modal
        visible={showTagInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTagInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>添加标签</Text>
            <View style={styles.tagInputContainer}>
              <CustomTextInput
                placeholder="输入标签名称..."
                value={newTag}
                onChangeText={setNewTag}
                maxLength={20}
                style={styles.tagInput}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowTagInput(false);
                  setNewTag('');
                }}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddTag}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>添加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* 表情选择器 */}
      {showEmojiPicker && (
        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          activeOpacity={1}
          onPress={() => setShowEmojiPicker(false)}
        >
          <View style={styles.emojiPickerContainer}>
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.emojiGrid}>
                  {emojiOptions.map((emoji, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.emojiItem}
                      onPress={() => handleInsertEmoji(emoji)}
                    >
                      <Text style={styles.emojiText}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
      
      {/* 图片选项模态框 */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.imageOptionsContainer}>
            <TouchableOpacity
              style={styles.imageOptionButton}
              onPress={handleTakePhoto}
            >
              <Text style={styles.imageOptionIcon}>📷</Text>
              <Text style={styles.imageOptionText}>拍照</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.imageOptionButton, { borderBottomWidth: 0 }]}
              onPress={handleSelectImage}
            >
              <Text style={styles.imageOptionIcon}>🖼️</Text>
              <Text style={styles.imageOptionText}>从相册选择</Text>
            </TouchableOpacity>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowImageOptions(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WriteDiaryScreen;