import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../theme/ThemeContext';
import DateRangePicker from '../components/DateRangePicker';

const { width } = Dimensions.get('window');

// 日记条目接口
interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  mood: {
    emoji: string;
    label: string;
  };
  date: Date;
  tags?: string[];
}

// 筛选类型
type FilterType = 'all' | 'month' | 'dateRange' | 'specificDate' | 'search';

interface DiaryListScreenProps {
  onGoBack: () => void;
  onWriteDiary?: () => void;
}

const DiaryListScreen: React.FC<DiaryListScreenProps> = ({ onGoBack, onWriteDiary }) => {
  const { theme } = useTheme();
  
  // 示例数据
  const [diaryEntries] = useState<DiaryEntry[]>([
    {
      id: '1',
      title: '美好的一天',
      content: '今天天气很好，心情也很棒。和朋友一起去公园散步，看到了很多美丽的花朵。',
      mood: { emoji: '😊', label: '开心' },
      date: new Date('2024-01-15'),
      tags: ['散步', '朋友', '公园']
    },
    {
      id: '2',
      title: '工作压力',
      content: '今天工作很忙，有点累。但是完成了一个重要的项目，还是很有成就感的。',
      mood: { emoji: '😤', label: '疲惫' },
      date: new Date('2024-01-14'),
      tags: ['工作', '项目', '成就感']
    },
    {
      id: '3',
      title: '平静的夜晚',
      content: '今晚在家看书，喝茶，感觉很平静。这样的时光很珍贵。',
      mood: { emoji: '😌', label: '平静' },
      date: new Date('2024-01-13'),
      tags: ['读书', '茶', '平静']
    },
    {
      id: '4',
      title: '雨天的思考',
      content: '下雨了，坐在窗边听雨声，思考了很多事情。有时候安静下来真的很好。',
      mood: { emoji: '🤔', label: '思考' },
      date: new Date('2024-01-12'),
      tags: ['雨天', '思考', '安静']
    },
    {
      id: '5',
      title: '运动的快乐',
      content: '今天去健身房锻炼，出了很多汗，感觉身体和心情都很好。',
      mood: { emoji: '💪', label: '活力' },
      date: new Date('2024-01-11'),
      tags: ['健身', '运动', '活力']
    }
  ]);
  
  // 状态管理
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchText, setSearchText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [specificDate, setSpecificDate] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  
  // 筛选日记条目
  const filteredEntries = useMemo(() => {
    let filtered = [...diaryEntries];
    
    switch (filterType) {
      case 'month':
        filtered = filtered.filter(entry => 
          entry.date.getMonth() === selectedMonth && 
          entry.date.getFullYear() === selectedYear
        );
        break;
      case 'dateRange':
        if (startDate && endDate) {
          filtered = filtered.filter(entry => 
            entry.date >= startDate && entry.date <= endDate
          );
        }
        break;
      case 'specificDate':
        if (specificDate) {
          const targetDate = new Date(specificDate);
          filtered = filtered.filter(entry => 
            entry.date.toDateString() === targetDate.toDateString()
          );
        }
        break;
      case 'search':
        if (searchText) {
          filtered = filtered.filter(entry => 
            entry.title.toLowerCase().includes(searchText.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchText.toLowerCase())
          );
        }
        break;
    }
    
    // 按时间倒序排列
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [diaryEntries, filterType, searchText, selectedMonth, selectedYear, startDate, endDate, specificDate]);
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  
  // 获取月份名称
  const getMonthName = (month: number) => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return months[month];
  };
  
  // 处理日期范围选择确认
  const handleDateRangeConfirm = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setFilterType('dateRange');
    setShowFilterModal(false);
  };
  
  // 重置筛选
  const resetFilter = () => {
    setFilterType('all');
    setSearchText('');
    setStartDate(null);
    setEndDate(null);
    setSpecificDate('');
    setShowFilterModal(false);
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
    filterButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
    },
    filterButtonText: {
      fontSize: 14,
      color: theme.colors.buttonText,
      fontWeight: '600',
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    searchInput: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
    },
    filterInfo: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.primary + '10',
    },
    filterInfoText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    diaryItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginVertical: theme.spacing.sm,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    diaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    diaryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    diaryMood: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    diaryMoodEmoji: {
      fontSize: 20,
      marginRight: theme.spacing.xs,
    },
    diaryMoodLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    diaryDate: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    diaryContent: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
      marginBottom: theme.spacing.sm,
    },
    diaryTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    tag: {
      backgroundColor: theme.colors.primary + '20',
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    tagText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl * 2,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    emptyEmoji: {
      fontSize: 48,
    },
    // 筛选模态框样式
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
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    filterOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.inputBorder,
    },
    filterOptionText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
    },
    filterOptionSelected: {
      backgroundColor: theme.colors.primary + '10',
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
    },
    dateInput: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: 14,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      marginVertical: theme.spacing.xs,
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
    // 年月份选择器样式
    yearMonthContainer: {
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginVertical: theme.spacing.sm,
    },
    yearInputContainer: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    monthPickerContainer: {
      flex: 1,
    },
    inputLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      fontWeight: '500',
    },
    yearInput: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: 16,
      height: 50,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      textAlign: 'center',
    },
    pickerWrapper: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      overflow: 'hidden',
    },
    monthPicker: {
      height: 50,
      color: theme.colors.text,
    },
    pickerItem: {
      fontSize: 14,
      color: theme.colors.text,
    },
    // 悬浮按钮样式
    floatingButton: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    floatingButtonIcon: {
      fontSize: 24,
      color: theme.colors.buttonText,
    },
  }), [theme]);
  
  // 渲染筛选信息
  const renderFilterInfo = () => {
    if (filterType === 'all') return null;
    
    let info = '';
    switch (filterType) {
      case 'month':
        info = `筛选：${selectedYear}年${getMonthName(selectedMonth)}`;
        break;
      case 'dateRange':
        if (startDate && endDate) {
          info = `筛选：${formatDate(startDate)} 至 ${formatDate(endDate)}`;
        }
        break;
      case 'specificDate':
        info = `筛选：${specificDate}`;
        break;
      case 'search':
        info = `搜索："${searchText}"`;
        break;
    }
    
    return (
      <View style={styles.filterInfo}>
        <Text style={styles.filterInfoText}>{info} (共{filteredEntries.length}条)</Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>心情日记</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
          <Text style={styles.filterButtonText}>筛选</Text>
        </TouchableOpacity>
      </View>
      
      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索标题或内容..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            setFilterType(text ? 'search' : 'all');
          }}
        />
      </View>
      
      {/* 筛选信息 */}
      {renderFilterInfo()}
      
      {/* 日记列表 */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <TouchableOpacity key={entry.id} style={styles.diaryItem} activeOpacity={0.7}>
              <View style={styles.diaryHeader}>
                <Text style={styles.diaryTitle}>{entry.title}</Text>
                <View style={styles.diaryMood}>
                  <Text style={styles.diaryMoodEmoji}>{entry.mood.emoji}</Text>
                  <Text style={styles.diaryMoodLabel}>{entry.mood.label}</Text>
                </View>
              </View>
              <Text style={styles.diaryDate}>{formatDate(entry.date)}</Text>
              <Text style={styles.diaryContent} numberOfLines={3}>
                {entry.content}
              </Text>
              {entry.tags && entry.tags.length > 0 && (
                <View style={styles.diaryTags}>
                  {entry.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>
              {filterType === 'all' ? '还没有日记记录\n开始记录你的心情吧！' : '没有找到符合条件的日记'}
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* 悬浮写日记按钮 */}
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={onWriteDiary}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonIcon}>✏️</Text>
      </TouchableOpacity>
      
      {/* 筛选模态框 */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>筛选选项</Text>
            
            <ScrollView>
              {/* 全部 */}
              <TouchableOpacity
                style={[styles.filterOption, filterType === 'all' && styles.filterOptionSelected]}
                onPress={() => setFilterType('all')}
              >
                <Text style={styles.filterOptionText}>📋 全部日记</Text>
              </TouchableOpacity>
              
              {/* 按月份筛选 */}
              <TouchableOpacity
                style={[styles.filterOption, filterType === 'month' && styles.filterOptionSelected]}
                onPress={() => setFilterType('month')}
              >
                <Text style={styles.filterOptionText}>📅 按月份筛选</Text>
              </TouchableOpacity>
              
              {filterType === 'month' && (
                <View style={{ paddingLeft: theme.spacing.xl }}>
                  <View style={styles.yearMonthContainer}>
                    <View style={styles.yearInputContainer}>
                      <Text style={styles.inputLabel}>年份</Text>
                      <TextInput
                        style={styles.yearInput}
                        placeholder="2024"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={selectedYear.toString()}
                        onChangeText={(text) => setSelectedYear(parseInt(text) || new Date().getFullYear())}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.monthPickerContainer}>
                      <Text style={styles.inputLabel}>月份</Text>
                      <View style={styles.pickerWrapper}>
                        <Picker
                          selectedValue={selectedMonth}
                          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                          style={styles.monthPicker}
                          itemStyle={styles.pickerItem}
                        >
                          <Picker.Item label="1月" value={0} />
                          <Picker.Item label="2月" value={1} />
                          <Picker.Item label="3月" value={2} />
                          <Picker.Item label="4月" value={3} />
                          <Picker.Item label="5月" value={4} />
                          <Picker.Item label="6月" value={5} />
                          <Picker.Item label="7月" value={6} />
                          <Picker.Item label="8月" value={7} />
                          <Picker.Item label="9月" value={8} />
                          <Picker.Item label="10月" value={9} />
                          <Picker.Item label="11月" value={10} />
                          <Picker.Item label="12月" value={11} />
                        </Picker>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              
              {/* 按日期范围筛选 */}
              <TouchableOpacity
                style={[styles.filterOption, filterType === 'dateRange' && styles.filterOptionSelected]}
                onPress={() => {
                  setShowFilterModal(false);
                  setShowDateRangePicker(true);
                }}
              >
                <Text style={styles.filterOptionText}>📆 按日期范围筛选</Text>
              </TouchableOpacity>
              
              {filterType === 'dateRange' && startDate && endDate && (
                <View style={{ paddingLeft: theme.spacing.xl, paddingVertical: theme.spacing.sm }}>
                  <Text style={styles.filterOptionText}>
                    {formatDate(startDate)} 至 {formatDate(endDate)}
                  </Text>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetFilter}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>重置</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* 日期范围选择器 */}
      <DateRangePicker
        visible={showDateRangePicker}
        onClose={() => setShowDateRangePicker(false)}
        onConfirm={handleDateRangeConfirm}
        initialStartDate={startDate || undefined}
        initialEndDate={endDate || undefined}
        title="选择日期范围"
      />
    </SafeAreaView>
  );
};

export default DiaryListScreen;