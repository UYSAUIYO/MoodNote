/**
 * 大学搜索组件
 * 支持模糊搜索功能
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { loadUniversityList, searchUniversities } from '../utils/universityLoader';

interface UniversitySearchProps {
  visible: boolean;
  selectedUniversity: string;
  onUniversitySelect: (university: string) => void;
  onClose: () => void;
}

const UniversitySearch: React.FC<UniversitySearchProps> = ({
  visible,
  selectedUniversity,
  onUniversitySelect,
  onClose,
}) => {
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [universities, setUniversities] = useState<string[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<string[]>([]);

  // 加载大学列表
  useEffect(() => {
    loadUniversities();
  }, []);

  // 搜索过滤
  useEffect(() => {
    const filtered = searchUniversities(searchText, universities);
    setFilteredUniversities(filtered);
  }, [searchText, universities]);

  const loadUniversities = async () => {
    try {
      const universityList = await loadUniversityList();
      setUniversities(universityList);
      setFilteredUniversities(universityList.slice(0, 50));
    } catch (error) {
      console.error('加载大学列表失败:', error);
    }
  };

  const handleUniversitySelect = (university: string) => {
    onUniversitySelect(university);
    setSearchText('');
    onClose();
  };

  const handleClose = () => {
    setSearchText('');
    onClose();
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: Dimensions.get('window').width * 0.9,
      height: Dimensions.get('window').height * 0.7,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.inputBorder,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    closeButtonText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    searchContainer: {
      marginBottom: theme.spacing.lg,
    },
    searchInput: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
    },
    listContainer: {
      flex: 1,
    },
    universityItem: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.inputBorder,
    },
    universityItemSelected: {
      backgroundColor: theme.colors.primary + '10',
    },
    universityText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    universityTextSelected: {
      color: theme.colors.primary,
      fontWeight: '500',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    resultCount: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
  });

  const renderUniversityItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedUniversity;
    
    return (
      <TouchableOpacity
        style={[
          styles.universityItem,
          isSelected && styles.universityItemSelected,
        ]}
        onPress={() => handleUniversitySelect(item)}
      >
        <Text
          style={[
            styles.universityText,
            isSelected && styles.universityTextSelected,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View />
            <Text style={styles.modalTitle}>选择学校</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>取消</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="搜索学校名称"
              placeholderTextColor={theme.colors.textSecondary}
              autoFocus
            />
          </View>

          <View style={styles.listContainer}>
            {filteredUniversities.length > 0 && (
              <Text style={styles.resultCount}>
                {searchText ? `找到 ${filteredUniversities.length} 个结果` : `显示前 ${filteredUniversities.length} 个学校`}
              </Text>
            )}
            
            {filteredUniversities.length > 0 ? (
              <FlatList
                data={filteredUniversities}
                renderItem={renderUniversityItem}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchText ? '未找到匹配的学校' : '加载中...'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UniversitySearch;