import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

interface DateRangePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  title?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialStartDate,
  initialEndDate,
  title = '选择日期范围'
}) => {
  const { theme } = useTheme();
  
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectingStart, setSelectingStart] = useState(true);
  
  // 获取月份的天数
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // 获取月份第一天是星期几
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // 生成日历数据
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    
    // 添加空白天数
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // 添加月份天数
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };
  
  // 检查日期是否在范围内
  const isDateInRange = (day: number) => {
    if (!startDate || !endDate || !day) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date >= startDate && date <= endDate;
  };
  
  // 检查是否是开始或结束日期
  const isStartOrEndDate = (day: number) => {
    if (!day) return false;
    const date = new Date(currentYear, currentMonth, day);
    return (
      (startDate && date.getTime() === startDate.getTime()) ||
      (endDate && date.getTime() === endDate.getTime())
    );
  };
  
  // 处理日期选择
  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    
    if (selectingStart) {
      setStartDate(selectedDate);
      setEndDate(null);
      setSelectingStart(false);
    } else {
      if (startDate && selectedDate < startDate) {
        // 如果选择的结束日期早于开始日期，交换它们
        setEndDate(startDate);
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
      setSelectingStart(true);
    }
  };
  
  // 格式化日期显示
  const formatDate = (date: Date | null) => {
    if (!date) return '请选择';
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  
  // 月份名称
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  
  // 星期名称
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  // 上一个月
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // 下一个月
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // 确认选择
  const handleConfirm = () => {
    if (startDate && endDate) {
      onConfirm(startDate, endDate);
      onClose();
    }
  };
  
  // 重置选择
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectingStart(true);
  };
  
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      width: width * 0.95,
      maxHeight: '85%',
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    dateRangeDisplay: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    dateDisplay: {
      flex: 1,
      alignItems: 'center',
    },
    dateLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    dateText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '600',
    },
    dateSeparator: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginHorizontal: theme.spacing.sm,
    },
    calendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    monthNavButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary + '20',
    },
    monthNavText: {
      fontSize: 18,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    monthYearText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    weekHeader: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    weekDay: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    weekDayText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    calendarGrid: {
      marginBottom: theme.spacing.lg,
    },
    calendarRow: {
      flexDirection: 'row',
    },
    dayCell: {
      flex: 1,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 1,
      borderRadius: theme.borderRadius.sm,
    },
    dayText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    selectedDay: {
      backgroundColor: theme.colors.primary,
    },
    selectedDayText: {
      color: theme.colors.buttonText,
      fontWeight: '600',
    },
    rangeDay: {
      backgroundColor: theme.colors.primary + '30',
    },
    todayDay: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    cancelButton: {
      backgroundColor: theme.colors.textSecondary + '20',
    },
    resetButton: {
      backgroundColor: theme.colors.accent + '20',
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: theme.colors.textSecondary,
    },
    resetButtonText: {
      color: theme.colors.accent,
    },
    confirmButtonText: {
      color: theme.colors.buttonText,
    },
    instruction: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
  });
  
  const calendarDays = generateCalendarDays();
  const today = new Date();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            
            {/* 日期范围显示 */}
            <View style={styles.dateRangeDisplay}>
              <View style={styles.dateDisplay}>
                <Text style={styles.dateLabel}>开始日期</Text>
                <Text style={styles.dateText}>{formatDate(startDate)}</Text>
              </View>
              <Text style={styles.dateSeparator}>至</Text>
              <View style={styles.dateDisplay}>
                <Text style={styles.dateLabel}>结束日期</Text>
                <Text style={styles.dateText}>{formatDate(endDate)}</Text>
              </View>
            </View>
            
            <Text style={styles.instruction}>
              {selectingStart ? '请选择开始日期' : '请选择结束日期'}
            </Text>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 日历头部 */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity style={styles.monthNavButton} onPress={goToPreviousMonth}>
                <Text style={styles.monthNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.monthYearText}>
                {currentYear}年{monthNames[currentMonth]}
              </Text>
              <TouchableOpacity style={styles.monthNavButton} onPress={goToNextMonth}>
                <Text style={styles.monthNavText}>›</Text>
              </TouchableOpacity>
            </View>
            
            {/* 星期头部 */}
            <View style={styles.weekHeader}>
              {weekDays.map((day) => (
                <View key={day} style={styles.weekDay}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>
            
            {/* 日历网格 */}
            <View style={styles.calendarGrid}>
              {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
                <View key={weekIndex} style={styles.calendarRow}>
                  {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                    const isToday = day && 
                      currentYear === today.getFullYear() && 
                      currentMonth === today.getMonth() && 
                      day === today.getDate();
                    
                    return (
                      <TouchableOpacity
                        key={dayIndex}
                        style={[
                          styles.dayCell,
                          day && isStartOrEndDate(day) ? styles.selectedDay : null,
                          day && isDateInRange(day) && !isStartOrEndDate(day) ? styles.rangeDay : null,
                          isToday ? styles.todayDay : null,
                        ]}
                        onPress={() => day && handleDateSelect(day)}
                        disabled={!day}
                      >
                        {day && (
                          <Text style={[
                            styles.dayText,
                            isStartOrEndDate(day) ? styles.selectedDayText : null,
                          ]}>
                            {day}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
          
          {/* 按钮 */}
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
              <Text style={[styles.buttonText, styles.resetButtonText]}>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={handleConfirm}
              disabled={!startDate || !endDate}
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateRangePicker;