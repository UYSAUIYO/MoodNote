/**
 * 日期选择器组件
 * 用于选择年月日
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface DatePickerProps {
  visible: boolean;
  date: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  visible,
  date,
  onDateChange,
  onClose,
}) => {
  const { theme } = useTheme();
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(date.getDate());

  // 生成年份列表（1950-2024）
  const years = Array.from({ length: 75 }, (_, i) => 2024 - i);
  
  // 生成月份列表
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // 根据年月生成日期列表
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  
  const days = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => i + 1
  );

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    onDateChange(newDate);
    onClose();
  };

  const handleCancel = () => {
    // 重置为原始值
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth() + 1);
    setSelectedDay(date.getDate());
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
      width: Dimensions.get('window').width * 0.85,
      maxHeight: Dimensions.get('window').height * 0.6,
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
    cancelButton: {
      padding: theme.spacing.sm,
    },
    cancelButtonText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    confirmButton: {
      padding: theme.spacing.sm,
    },
    confirmButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    pickerContainer: {
      flexDirection: 'row',
      height: 200,
    },
    pickerColumn: {
      flex: 1,
      marginHorizontal: theme.spacing.sm,
    },
    pickerColumnTitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    pickerScrollView: {
      flex: 1,
    },
    pickerItem: {
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderRadius: theme.borderRadius.sm,
      marginVertical: 2,
    },
    pickerItemSelected: {
      backgroundColor: theme.colors.primary + '20',
    },
    pickerItemText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    pickerItemTextSelected: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  const renderPickerColumn = (
    title: string,
    items: number[],
    selectedValue: number,
    onSelect: (value: number) => void
  ) => (
    <View style={styles.pickerColumn}>
      <Text style={styles.pickerColumnTitle}>{title}</Text>
      <ScrollView
        style={styles.pickerScrollView}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.pickerItem,
              selectedValue === item && styles.pickerItemSelected,
            ]}
            onPress={() => onSelect(item)}
          >
            <Text
              style={[
                styles.pickerItemText,
                selectedValue === item && styles.pickerItemTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>选择日期</Text>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>确定</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            {renderPickerColumn('年', years, selectedYear, setSelectedYear)}
            {renderPickerColumn('月', months, selectedMonth, setSelectedMonth)}
            {renderPickerColumn('日', days, selectedDay, setSelectedDay)}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DatePicker;