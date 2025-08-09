import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { launchImageLibrary, launchCamera, MediaType } from 'react-native-image-picker';
import Video from 'react-native-video';
import { useTheme } from '../theme/ThemeContext';
import { CameraIcon, ImageIcon, TagIcon, BackIcon } from '../components/Icons';

const { width } = Dimensions.get('window');

// 心情选项配置 - 与主页保持一致的12种情绪状态
const MOOD_OPTIONS = [
  { emoji: '😊', label: '开心', color: '#FFD93D' },  // 黄色 - 积极情绪
  { emoji: '😔', label: '难过', color: '#6C7CE0' },  // 蓝色 - 消极情绪
  { emoji: '😰', label: '焦虑', color: '#FF6B6B' },  // 红色 - 紧张情绪
  { emoji: '😡', label: '愤怒', color: '#FF4757' },  // 深红色 - 愤怒情绪
  { emoji: '😴', label: '疲惫', color: '#A4B0BE' },  // 灰色 - 疲劳状态
  { emoji: '🤔', label: '思考', color: '#FFA502' },  // 橙色 - 思考状态
  { emoji: '😌', label: '平静', color: '#7BED9F' },  // 绿色 - 平和情绪
  { emoji: '😍', label: '兴奋', color: '#FF6348' },  // 橙红色 - 兴奋情绪
  { emoji: '😢', label: '伤心', color: '#70A1FF' },  // 浅蓝色 - 悲伤情绪
  { emoji: '😤', label: '烦躁', color: '#FF7675' },  // 粉红色 - 烦躁情绪
  { emoji: '🥰', label: '感激', color: '#FD79A8' },  // 粉色 - 感恩情绪
  { emoji: '😐', label: '无聊', color: '#FDCB6E' },  // 黄橙色 - 无聊状态
];


interface DiaryEditScreenProps {
  onBack?: () => void;
  onSave?: (diary: any) => void;
}

const DiaryEditScreen: React.FC<DiaryEditScreenProps> = ({ onBack, onSave }) => {
  const { theme } = useTheme();
  
  // 状态管理
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<Array<{uri: string, type: 'image' | 'video', name?: string, duration?: number, fileSize?: number}>>([]);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{uri: string, type: 'image' | 'video'} | null>(null);

  // 拍照
  const takePhoto = () => {
    const options = {
      mediaType: 'mixed' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as const,
      videoQuality: 'medium' as const,
      durationLimit: 60,
    };

    launchCamera(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const isVideo = asset.type?.startsWith('video/');
        const newMedia = {
          uri: asset.uri!,
          type: isVideo ? 'video' as const : 'image' as const,
          name: asset.fileName,
          duration: asset.duration,
          fileSize: asset.fileSize,
        };
        setMediaFiles(prev => [...prev, newMedia]);
      }
    });
  };

  // 选择照片
  const selectPhoto = () => {
    const options = {
      mediaType: 'mixed' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as const,
      videoQuality: 'medium' as const,
      durationLimit: 60,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const isVideo = asset.type?.startsWith('video/');
        const newMedia = {
          uri: asset.uri!,
          type: isVideo ? 'video' as const : 'image' as const,
          name: asset.fileName,
          duration: asset.duration,
          fileSize: asset.fileSize,
        };
        setMediaFiles(prev => [...prev, newMedia]);
      }
    });
  };

  // 删除媒体文件
  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 保存日记
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('提示', '请填写标题和内容');
      return;
    }

    setIsSaving(true);
    try {
      // 这里可以添加实际的保存逻辑
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟保存过程
      
      if (onSave) {
        onSave({
          title,
          content,
          mood: selectedMood,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          date: new Date().toISOString(),
          mediaFiles, // 包含媒体文件
        });
      }
      
      Alert.alert('成功', '日记保存成功!', [
        { text: '确定', onPress: onBack }
      ]);
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 样式定义
  const styles = StyleSheet.create({
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
      backgroundColor: theme.colors.primary + '20',
    },
    backButtonText: {
      fontSize: 18,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },
    saveButton: {
      padding: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
    },
    saveButtonDisabled: {
      backgroundColor: theme.colors.inputBorder,
    },
    saveButtonText: {
      fontSize: 14,
      color: theme.colors.buttonText,
      fontWeight: '600',
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    titleInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
    },
    contentInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      minHeight: 120,
      textAlignVertical: 'top',
    },
    moodContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    moodOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
    },
    moodOptionSelected: {
      backgroundColor: theme.colors.primary + '20',
      borderColor: theme.colors.primary,
    },
    moodEmoji: {
      fontSize: 20,
      marginRight: theme.spacing.sm,
    },
    moodLabel: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
    },
    tagsInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
    },
    tagsHint: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    mediaButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
    },
    mediaButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    mediaList: {
      marginTop: theme.spacing.md,
    },
    mediaItem: {
      position: 'relative',
      marginRight: theme.spacing.sm,
    },
    mediaPreview: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.inputBorder,
    },
    videoPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    videoPreview: {
      width: '100%',
      height: '100%',
    },
    videoOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    videoIcon: {
      fontSize: 24,
    },
    removeMediaButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#FF4757',
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeMediaText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    videoDuration: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#FFFFFF',
      fontSize: 10,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    mediaFileSize: {
      position: 'absolute',
      bottom: -16,
      left: 0,
      right: 0,
      fontSize: 10,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    // 底部工具栏样式
    bottomToolbar: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.inputBorder,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      justifyContent: 'space-around',
    },
    toolbarButton: {
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      flex: 1,
      maxWidth: 80,
    },
    toolbarButtonActive: {
      backgroundColor: theme.colors.primary + '20',
    },
    toolbarButtonIcon: {
      fontSize: 20,
      marginBottom: theme.spacing.xs,
    },
    toolbarButtonText: {
      fontSize: 11,
      color: theme.colors.text,
      fontWeight: '500',
      textAlign: 'center',
    },
    // 弹出层样式
    popupOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tagsPopupOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    moodSelectorPopup: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      margin: theme.spacing.lg,
      maxHeight: '70%',
      width: '90%',
    },
    tagsInputPopup: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      margin: theme.spacing.lg,
      width: '90%',
      marginBottom: 100,
    },
    popupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    popupTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    popupCloseButton: {
      fontSize: 24,
      color: theme.colors.textSecondary,
      fontWeight: 'bold',
    },
    // 预览组件样式
    selectedMoodContainer: {
      alignItems: 'flex-start',
    },
    selectedMoodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    selectedMoodEmoji: {
      fontSize: 20,
      marginRight: theme.spacing.sm,
    },
    selectedMoodLabel: {
      fontSize: 14,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    tagsPreviewContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    tagPreviewItem: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    tagPreviewText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    bottomSpacer: {
      height: theme.spacing.xl,
    },
    // 媒体预览弹出层样式
    mediaPreviewOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    mediaPreviewCloseArea: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mediaPreviewContainer: {
      width: '90%',
      height: '80%',
      position: 'relative',
    },
    mediaPreviewCloseButton: {
      position: 'absolute',
      top: -40,
      right: 0,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1001,
    },
    mediaPreviewCloseText: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
    },
    fullScreenImage: {
      width: '100%',
      height: '100%',
      borderRadius: theme.borderRadius.lg,
    },
    fullScreenVideo: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
    },
    videoPreviewIcon: {
      fontSize: 80,
      marginBottom: theme.spacing.lg,
    },
    videoPreviewText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    videoPreviewHint: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 14,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <BackIcon size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          写日记
        </Text>
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 标题输入 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>标题</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="给你的日记起个标题吧..."
              placeholderTextColor={theme.colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>

          {/* 内容输入 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>内容</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="记录下今天发生的事情..."
              placeholderTextColor={theme.colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* 媒体文件预览 */}
          {mediaFiles.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>已添加的媒体 ({mediaFiles.length})</Text>
              <FlatList
                data={mediaFiles}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                style={styles.mediaList}
                renderItem={({ item, index }) => (
                  <View style={styles.mediaItem}>
                    <TouchableOpacity
                      onPress={() => setPreviewMedia({ uri: item.uri, type: item.type })}
                      activeOpacity={0.8}
                    >
                      {item.type === 'image' ? (
                         <Image source={{ uri: item.uri }} style={styles.mediaPreview} resizeMode="cover" />
                       ) : (
                         <View style={styles.mediaPreview}>
                           <Video
                             source={{ uri: item.uri }}
                             style={styles.videoPreview}
                             resizeMode="cover"
                             paused={true}
                             muted={true}
                           />
                           <View style={styles.videoOverlay}>
                             <Text style={styles.videoIcon}>▶</Text>
                           </View>
                           {item.duration && (
                             <Text style={styles.videoDuration}>
                               {Math.floor(item.duration / 60)}:{(item.duration % 60).toFixed(0).padStart(2, '0')}
                             </Text>
                           )}
                         </View>
                       )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeMediaButton}
                      onPress={() => removeMedia(index)}
                    >
                      <Text style={styles.removeMediaText}>×</Text>
                    </TouchableOpacity>
                    {item.fileSize && (
                      <Text style={styles.mediaFileSize}>
                        {(item.fileSize / 1024 / 1024).toFixed(1)}MB
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          )}

          {/* 心情选择预览 */}
          {selectedMood && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>当前心情</Text>
              <View style={styles.selectedMoodContainer}>
                {MOOD_OPTIONS.find(mood => mood.label === selectedMood) && (
                  <View style={[
                    styles.selectedMoodItem,
                    { backgroundColor: MOOD_OPTIONS.find(mood => mood.label === selectedMood)!.color }
                  ]}>
                    <Text style={styles.selectedMoodEmoji}>
                      {MOOD_OPTIONS.find(mood => mood.label === selectedMood)!.emoji}
                    </Text>
                    <Text style={styles.selectedMoodLabel}>{selectedMood}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* 标签预览 */}
          {tags.trim() && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>标签</Text>
              <View style={styles.tagsPreviewContainer}>
                {tags.split(',').map((tag, index) => (
                  tag.trim() && (
                    <View key={index} style={styles.tagPreviewItem}>
                      <Text style={styles.tagPreviewText}>#{tag.trim()}</Text>
                    </View>
                  )
                ))}
              </View>
            </View>
          )}

          {/* 底部间距，避免被工具栏遮挡 */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* 底部工具栏 */}
        <View style={styles.bottomToolbar}>
          {/* 心情选择工具 */}
          <TouchableOpacity
            style={[styles.toolbarButton, selectedMood && styles.toolbarButtonActive]}
            onPress={() => setShowMoodSelector(!showMoodSelector)}
          >
            <Text style={styles.toolbarButtonIcon}>😊</Text>
            <Text style={styles.toolbarButtonText}>心情</Text>
          </TouchableOpacity>

          {/* 标签工具 */}
          <TouchableOpacity
            style={[styles.toolbarButton, tags.trim() && styles.toolbarButtonActive]}
            onPress={() => setShowTagsInput(!showTagsInput)}
          >
            <TagIcon size={20} color={tags.trim() ? theme.colors.primary : theme.colors.textSecondary} />
            <Text style={styles.toolbarButtonText}>标签</Text>
          </TouchableOpacity>

          {/* 相机工具 */}
          <TouchableOpacity
            style={[styles.toolbarButton, mediaFiles.length > 0 && styles.toolbarButtonActive]}
            onPress={takePhoto}
          >
            <CameraIcon size={20} color={mediaFiles.length > 0 ? theme.colors.primary : theme.colors.textSecondary} />
            <Text style={styles.toolbarButtonText}>相机</Text>
          </TouchableOpacity>

          {/* 相册工具 */}
          <TouchableOpacity
            style={[styles.toolbarButton, mediaFiles.length > 0 && styles.toolbarButtonActive]}
            onPress={selectPhoto}
          >
            <ImageIcon size={20} color={mediaFiles.length > 0 ? theme.colors.primary : theme.colors.textSecondary} />
            <Text style={styles.toolbarButtonText}>相册</Text>
          </TouchableOpacity>
        </View>

        {/* 心情选择器弹出层 */}
        {showMoodSelector && (
          <View style={styles.popupOverlay}>
            <View style={styles.moodSelectorPopup}>
              <View style={styles.popupHeader}>
                <Text style={styles.popupTitle}>选择心情</Text>
                <TouchableOpacity onPress={() => setShowMoodSelector(false)}>
                  <Text style={styles.popupCloseButton}>×</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.moodContainer}>
                {MOOD_OPTIONS.map((mood, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.moodOption,
                      {
                        backgroundColor: selectedMood === mood.label ? mood.color : theme.colors.surface,
                        borderColor: selectedMood === mood.label ? mood.color : theme.colors.inputBorder,
                        borderWidth: selectedMood === mood.label ? 2 : 1,
                      },
                    ]}
                    onPress={() => {
                      setSelectedMood(mood.label);
                      setShowMoodSelector(false);
                    }}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={[
                      styles.moodLabel,
                      {
                        color: selectedMood === mood.label ? '#FFFFFF' : theme.colors.text,
                        fontWeight: selectedMood === mood.label ? '600' : '500',
                      },
                    ]}>
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* 标签输入弹出层 */}
        {showTagsInput && (
          <KeyboardAvoidingView 
            style={styles.tagsPopupOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <View style={styles.tagsInputPopup}>
              <View style={styles.popupHeader}>
                <Text style={styles.popupTitle}>添加标签</Text>
                <TouchableOpacity onPress={() => setShowTagsInput(false)}>
                  <Text style={styles.popupCloseButton}>×</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.tagsInput}
                placeholder="添加标签，用逗号分隔"
                placeholderTextColor={theme.colors.textSecondary}
                value={tags}
                onChangeText={setTags}
                maxLength={100}
                autoFocus
              />
              <Text style={styles.tagsHint}>例如：工作,朋友,运动</Text>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* 媒体预览弹出层 */}
        {previewMedia && (
          <View style={styles.mediaPreviewOverlay}>
            <TouchableOpacity 
              style={styles.mediaPreviewCloseArea}
              onPress={() => setPreviewMedia(null)}
              activeOpacity={1}
            >
              <View style={styles.mediaPreviewContainer}>
                <TouchableOpacity 
                  style={styles.mediaPreviewCloseButton}
                  onPress={() => setPreviewMedia(null)}
                >
                  <Text style={styles.mediaPreviewCloseText}>×</Text>
                </TouchableOpacity>
                
                {previewMedia.type === 'image' ? (
                   <Image
                     source={{ uri: previewMedia.uri }}
                     style={styles.fullScreenImage}
                     resizeMode="contain"
                   />
                 ) : (
                   <Video
                     source={{ uri: previewMedia.uri }}
                     style={styles.fullScreenVideo}
                     resizeMode="contain"
                     controls={true}
                     paused={false}
                   />
                 )}
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DiaryEditScreen;