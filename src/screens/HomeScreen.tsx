// React核心库和Hooks
import React, { useState, useRef, useEffect } from 'react';
// React Native组件和API
import {
  Dimensions,      // 获取设备屏幕尺寸
  View,           // 基础容器组件
  Text,           // 文本组件
  TouchableOpacity, // 可触摸的不透明度组件
  SafeAreaView,   // 安全区域视图组件
  ScrollView,     // 滚动视图组件
  Animated,       // 动画API
  Easing,         // 缓动函数
  StyleSheet,     // 样式表
} from 'react-native';
// 主题上下文Hook
import { useTheme } from '../theme/ThemeContext';

// 主屏幕组件的Props接口定义
interface HomeScreenProps {
  onLogout?: () => void; // 可选的登出回调函数
  onNavigateToDiaryList?: () => void; // 可选的导航到日记列表回调函数
}

// 主屏幕组件：心情记录应用的核心界面
const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout, onNavigateToDiaryList }) => {
  // 获取当前主题配置
  const { theme } = useTheme();
  
  // 状态管理
  const [selectedMood, setSelectedMood] = useState<string | null>(null); // 当前选中的心情
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month'); // 日历视图模式：月视图或周视图
  const [currentDate, setCurrentDate] = useState(new Date()); // 当前选中的日期
  const [isMoodWheelVisible, setIsMoodWheelVisible] = useState(false); // 心情选择圆盘的显示状态
  // 存储每天的心情记录 - 格式: { 'YYYY-MM-DD': { emoji: '😊', label: '开心' } }
  const [dailyMoods, setDailyMoods] = useState<Record<string, { emoji: string; label: string }>>(() => {
    // 初始化时添加一些示例数据用于演示
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    return {
      [formatDateKey(today)]: { emoji: '😊', label: '开心' },
      [formatDateKey(yesterday)]: { emoji: '😔', label: '难过' },
      [formatDateKey(twoDaysAgo)]: { emoji: '😌', label: '平静' },
    };
  });

  // 格式化日期为字符串键的辅助函数（用于初始化和存储心情数据）
  function formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式
  }
  
  // 动画值引用 - 用于页面加载和交互动画
  const fadeAnim = useRef(new Animated.Value(0)).current;        // 淡入动画
  const slideAnim = useRef(new Animated.Value(30)).current;      // 滑动动画
  const scaleAnim = useRef(new Animated.Value(0.9)).current;     // 缩放动画
  const wheelOpacity = useRef(new Animated.Value(0)).current;    // 心情圆盘透明度
  const wheelScale = useRef(new Animated.Value(0.1)).current;    // 心情圆盘缩放
  const wheelTranslateX = useRef(new Animated.Value(0)).current; // 心情圆盘水平位移
  const wheelTranslateY = useRef(new Animated.Value(0)).current; // 心情圆盘垂直位移
  const buttonOpacity = useRef(new Animated.Value(1)).current;   // 悬浮按钮透明度
  const calendarOpacity = useRef(new Animated.Value(1)).current; // 日历视图透明度
  const calendarScale = useRef(new Animated.Value(1)).current;   // 日历视图缩放

  // 获取设备屏幕宽度，用于响应式布局
  const { width } = Dimensions.get('window');

  // 心情选项配置 - 包含12种不同的情绪状态
  // 每个选项包含表情符号、中文标签和对应的主题色彩
  const moodOptions = [
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

  // 页面加载时的入场动画效果
  // 使用并行动画同时执行淡入、滑动和缩放效果
  useEffect(() => {
    Animated.parallel([
      // 淡入动画：从透明到完全不透明
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic), // 使用三次贝塞尔缓动
        useNativeDriver: true, // 启用原生驱动以提高性能
      }),
      // 滑动动画：从下方30像素滑动到原位置
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // 缩放动画：从0.9倍缩放到正常大小
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(); // 启动动画
  }, []); // 空依赖数组，仅在组件挂载时执行一次
  // 处理用户选择心情的逻辑
  const handleMoodSelect = (mood: string) => {
    // 更新当前选中的心情状态
    setSelectedMood(mood);
    
    // 将心情记录保存到当前选中的日期
    const dateKey = formatDateKey(currentDate);
    const moodData = moodOptions.find(m => m.label === mood);
    
    if (moodData) {
      // 更新每日心情记录，使用函数式更新确保状态不可变性
      setDailyMoods(prev => ({
        ...prev, // 保留之前的记录
        [dateKey]: { emoji: moodData.emoji, label: moodData.label } // 添加或更新当前日期的心情
      }));
    }
  };


  // 获取指定日期的心情记录
  // 参数：date - 要查询的日期对象
  // 返回：该日期的心情数据对象或undefined
  const getMoodForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return dailyMoods[dateKey];
  };

  // 打开心情选择圆盘的动画函数
  const openMoodWheel = () => {
    // 设置圆盘为可见状态
    setIsMoodWheelVisible(true);
    
    // 获取设备屏幕尺寸
    const { width, height } = Dimensions.get('window');
    
    // 计算悬浮按钮位置（左下角）
    const buttonX = 30; // 距离左边30像素
    const buttonY = height - 120; // 距离底部120像素
    
    // 计算屏幕中心位置
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 计算从按钮位置到屏幕中心的偏移量
    const translateX = centerX - buttonX - 30; // 减去按钮宽度的一半
    const translateY = centerY - buttonY - 30; // 减去按钮高度的一半
    
    // 设置初始位置为悬浮按钮位置
    wheelTranslateX.setValue(-translateX);
    wheelTranslateY.setValue(-translateY);
    
    // 执行圆盘出现和按钮隐藏的并行动画
    Animated.parallel([
      // 悬浮按钮淡出动画
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      // 透明度动画：从完全透明到完全不透明
      Animated.timing(wheelOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // 缩放动画：从0.1倍放大到正常大小，带有弹性效果
      Animated.timing(wheelScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.2)), // 回弹缓动效果
        useNativeDriver: true,
      }),
      // 水平位移动画：从按钮位置移动到屏幕中心
      Animated.timing(wheelTranslateX, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // 垂直位移动画：从按钮位置移动到屏幕中心
      Animated.timing(wheelTranslateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 关闭心情选择圆盘的动画函数
  const closeMoodWheel = () => {
    // 获取设备屏幕尺寸
    const { width, height } = Dimensions.get('window');
    
    // 计算悬浮按钮位置（左下角）
    const buttonX = 30; // 距离左边30像素
    const buttonY = height - 120; // 距离底部120像素
    
    // 计算屏幕中心位置
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 计算从屏幕中心到按钮位置的偏移量
    const translateX = centerX - buttonX - 30; // 减去按钮宽度的一半
    const translateY = centerY - buttonY - 30; // 减去按钮高度的一半
    
    // 执行圆盘消失和按钮显示的并行动画
    Animated.parallel([
      // 透明度动画：从完全不透明到完全透明
      Animated.timing(wheelOpacity, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.cubic), // 使用缓入效果
        useNativeDriver: true,
      }),
      // 缩放动画：从正常大小缩小到0.1倍
      Animated.timing(wheelScale, {
        toValue: 0.1,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      // 水平位移动画：从屏幕中心移动回按钮位置
      Animated.timing(wheelTranslateX, {
        toValue: -translateX,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      // 垂直位移动画：从屏幕中心移动回按钮位置
      Animated.timing(wheelTranslateY, {
        toValue: -translateY,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 动画完成后隐藏圆盘组件并显示悬浮按钮
      setIsMoodWheelVisible(false);
      
      // 悬浮按钮淡入动画
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  };

  // 计算心情选项在圆盘上的位置坐标
  // 参数：index - 当前心情选项的索引，total - 总心情选项数量，radius - 圆盘半径
  // 返回：包含x和y坐标的对象
  const getMoodPosition = (index: number, total: number, radius: number) => {
    // 计算每个选项的角度，从顶部（-π/2）开始均匀分布
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    // 使用三角函数计算在圆周上的坐标
    const x = Math.cos(angle) * radius; // 水平坐标
    const y = Math.sin(angle) * radius; // 垂直坐标
    return { x, y };
  };

  // 切换日历视图模式（月视图 ↔ 周视图）
  const toggleCalendarView = () => {
    // 执行视图切换动画
    Animated.sequence([
      // 第一阶段：淡出当前视图
      Animated.parallel([
        Animated.timing(calendarOpacity, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(calendarScale, {
          toValue: 0.95,
          duration: 150,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // 第二阶段：切换视图并淡入新视图
      Animated.parallel([
        Animated.timing(calendarOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(calendarScale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // 在第一阶段动画完成后切换视图状态
    setTimeout(() => {
      setCalendarView(calendarView === 'month' ? 'week' : 'month');
    }, 150);
  };

  // 获取指定月份的所有日期（包含前后月份的日期以填满6周42天的网格）
  // 参数：date - 目标月份的任意日期
  // 返回：包含42个日期对象的数组，用于月视图显示
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1); // 当月第一天
    const lastDay = new Date(year, month + 1, 0); // 当月最后一天
    const startDate = new Date(firstDay);
    // 调整到当月第一天所在周的周日
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    // 生成6周共42天的日期数组
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // 获取指定日期所在周的所有日期（周日到周六）
  // 参数：date - 目标周内的任意日期
  // 返回：包含7个日期对象的数组，用于周视图显示
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    // 调整到当周的周日
    startOfWeek.setDate(date.getDate() - date.getDay());

    const days = [];
    // 生成一周7天的日期数组
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // 格式化日期信息，提取日期的各种属性用于UI显示
  // 参数：date - 要格式化的日期对象
  // 返回：包含日期详细信息的对象
  const formatDate = (date: Date) => {
    return {
      day: date.getDate(), // 日期数字（1-31）
      month: date.getMonth(), // 月份索引（0-11）
      year: date.getFullYear(), // 完整年份
      isToday: date.toDateString() === new Date().toDateString(), // 是否为今天
      isCurrentMonth: date.getMonth() === currentDate.getMonth(), // 是否为当前选中月份
    };
  };

  // 获取中文月份名称
  // 参数：date - 日期对象
  // 返回：对应的中文月份字符串
  const getMonthName = (date: Date) => {
    const months = ['一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return months[date.getMonth()];
  };

  // 获取中文星期名称数组
  // 返回：从周日到周六的中文简称数组
  const getWeekDayNames = () => {
    return ['日', '一', '二', '三', '四', '五', '六'];
  };

  // 导航到上一个时间段（月视图：上一月，周视图：上一周）
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1); // 月视图：减少一个月
    } else {
      newDate.setDate(newDate.getDate() - 7); // 周视图：减少7天
    }
    setCurrentDate(newDate);
  };

  // 导航到下一个时间段（月视图：下一月，周视图：下一周）
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1); // 月视图：增加一个月
    } else {
      newDate.setDate(newDate.getDate() + 7); // 周视图：增加7天
    }
    setCurrentDate(newDate);
  };

  // 快速回到今天的日期
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 样式表定义 - 使用主题系统确保一致的视觉风格
  const styles = StyleSheet.create({
    // 主容器样式
    container: {
      flex: 1, // 占满整个屏幕
      backgroundColor: theme.colors.background, // 使用主题背景色
    },
    // 页面头部区域样式
    header: {
      paddingHorizontal: theme.spacing.lg, // 水平内边距
      paddingTop: theme.spacing.lg, // 顶部内边距
      paddingBottom: theme.spacing.md, // 底部内边距
    },
    // 主标题样式
    headerTitle: {
      fontSize: 28, // 大字号突出标题
      fontWeight: '800', // 超粗字体权重
      color: theme.colors.text, // 主题文本颜色
      marginBottom: theme.spacing.sm, // 底部外边距
      marginTop: 10, // 向下移动10个像素
    },
    // 副标题样式
    headerSubtitle: {
      fontSize: 16, // 中等字号
      color: theme.colors.textSecondary, // 次要文本颜色
      fontWeight: '300', // 细字体权重
    },
    // 主内容区域样式
    content: {
      flex: 1, // 占据剩余空间
      paddingHorizontal: theme.spacing.lg, // 水平内边距
    },
    // 章节标题样式
    sectionTitle: {
      fontSize: 20, // 较大字号
      fontWeight: '700', // 粗体
      color: theme.colors.text, // 主题文本颜色
      marginBottom: theme.spacing.lg, // 底部外边距
      marginTop: theme.spacing.md, // 顶部外边距
    },
    // 心情网格布局样式（已废弃，现使用圆盘选择）
    moodGrid: {
      flexDirection: 'row', // 水平排列
      flexWrap: 'wrap', // 允许换行
      justifyContent: 'space-between', // 两端对齐
      marginBottom: theme.spacing.xl, // 底部外边距
    },
    // 心情卡片样式（已废弃）
    moodCard: {
      width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2, // 响应式宽度：屏幕宽度的一半减去边距
      backgroundColor: theme.colors.surface, // 表面颜色
      borderRadius: theme.borderRadius.xl, // 大圆角
      padding: theme.spacing.lg, // 内边距
      marginBottom: theme.spacing.md, // 底部外边距
      alignItems: 'center', // 居中对齐
      // 阴影效果
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4, // Android阴影
    },
    // 选中状态的心情卡片样式
    moodCardSelected: {
      backgroundColor: theme.colors.primary, // 主题色背景
      transform: [{ scale: 1.05 }], // 轻微放大效果
    },
    // 心情表情符号样式
    moodEmoji: {
      fontSize: 32, // 大字号显示表情
      marginBottom: theme.spacing.sm, // 底部外边距
    },
    // 心情标签文本样式
    moodLabel: {
      fontSize: 14, // 小字号
      fontWeight: '600', // 半粗体
      color: theme.colors.text, // 主题文本颜色
      textAlign: 'center', // 居中对齐
    },
    // 选中状态的心情标签样式
    moodLabelSelected: {
      color: theme.colors.buttonText, // 按钮文本颜色（通常为白色）
    },
    // 快捷操作区域容器样式
    quickActions: {
      backgroundColor: theme.colors.surface, // 表面颜色
      borderRadius: theme.borderRadius.xl, // 大圆角
      padding: theme.spacing.lg, // 内边距
      marginBottom: theme.spacing.xl, // 底部外边距
      // 阴影效果
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4, // Android阴影
    },
    // 操作按钮样式
    actionButton: {
      backgroundColor: theme.colors.primary, // 主题色背景
      borderRadius: theme.borderRadius.lg, // 圆角
      paddingVertical: theme.spacing.md, // 垂直内边距
      paddingHorizontal: theme.spacing.lg, // 水平内边距
      marginBottom: theme.spacing.sm, // 底部外边距
      alignItems: 'center', // 居中对齐
    },
    // 操作按钮文本样式
    actionButtonText: {
      color: theme.colors.buttonText, // 按钮文本颜色
      fontSize: 16, // 中等字号
      fontWeight: '600', // 半粗体
    },
    // 登出按钮样式（调试用）
    logoutButton: {
      backgroundColor: theme.colors.error, // 错误/危险颜色（通常为红色）
      borderRadius: theme.borderRadius.lg, // 圆角
      paddingVertical: theme.spacing.md, // 垂直内边距
      paddingHorizontal: theme.spacing.lg, // 水平内边距
      alignItems: 'center', // 居中对齐
      marginTop: theme.spacing.lg, // 顶部外边距
    },
    // 登出按钮文本样式
    logoutButtonText: {
      color: theme.colors.buttonText, // 按钮文本颜色
      fontSize: 16, // 中等字号
      fontWeight: '600', // 半粗体
    },
    // === 日历相关样式 ===
    // 日历容器主样式
    calendarContainer: {
      backgroundColor: theme.colors.surface, // 表面颜色
      borderRadius: theme.borderRadius.xl, // 大圆角
      padding: theme.spacing.lg, // 内边距
      marginBottom: theme.spacing.xl, // 底部外边距
      // 阴影效果
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4, // Android阴影
    },
    // 日历头部（标题和切换按钮）
    calendarHeader: {
      flexDirection: 'row', // 水平排列
      justifyContent: 'space-between', // 两端对齐
      alignItems: 'center', // 垂直居中
      marginBottom: theme.spacing.lg, // 底部外边距
    },
    // 日历导航按钮区域
    calendarNavigation: {
      flexDirection: 'row', // 水平排列
      alignItems: 'center', // 垂直居中
      marginBottom: theme.spacing.md, // 底部外边距
    },
    // 导航按钮（上一个/下一个）
    navButton: {
      padding: theme.spacing.sm, // 内边距
      borderRadius: theme.borderRadius.md, // 中等圆角
      backgroundColor: theme.colors.primary + '20', // 主题色20%透明度背景
    },
    // 导航按钮文本
    navButtonText: {
      fontSize: 18, // 较大字号
      color: theme.colors.primary, // 主题色文本
      fontWeight: '600', // 半粗体
    },
    // "今天"快捷按钮
    todayButton: {
      paddingHorizontal: theme.spacing.md, // 水平内边距
      paddingVertical: theme.spacing.sm, // 垂直内边距
      borderRadius: theme.borderRadius.md, // 中等圆角
      backgroundColor: theme.colors.primary + '20', // 主题色20%透明度背景
      marginHorizontal: theme.spacing.md, // 水平外边距
    },
    // "今天"按钮文本
    todayButtonText: {
      fontSize: 12, // 小字号
      color: theme.colors.primary, // 主题色文本
      fontWeight: '600', // 半粗体
    },
    // 日历标题（显示年月）
    calendarTitle: {
      fontSize: 18, // 较大字号
      fontWeight: '700', // 粗体
      color: theme.colors.text, // 主题文本颜色
    },
    // 视图切换按钮（月视图/周视图）
    viewToggleButton: {
      backgroundColor: theme.colors.primary, // 主题色背景
      paddingHorizontal: theme.spacing.md, // 水平内边距
      paddingVertical: theme.spacing.sm, // 垂直内边距
      borderRadius: theme.borderRadius.md, // 中等圆角
    },
    // 视图切换按钮文本
    viewToggleText: {
      color: theme.colors.buttonText, // 按钮文本颜色
      fontSize: 12, // 小字号
      fontWeight: '600', // 半粗体
    },
    // 星期标题行
    weekDayHeader: {
      flexDirection: 'row', // 水平排列
      marginBottom: theme.spacing.sm, // 底部外边距
    },
    // 星期名称样式
    weekDayName: {
      flex: 1, // 平均分配宽度
      textAlign: 'center', // 居中对齐
      fontSize: 12, // 小字号
      fontWeight: '600', // 半粗体
      color: theme.colors.textSecondary, // 次要文本颜色
      paddingVertical: theme.spacing.sm, // 垂直内边距
    },
    // 日历网格容器（月视图）
    calendarGrid: {
      flexDirection: 'row', // 水平排列
      flexWrap: 'wrap', // 允许换行
    },
    // 日期单元格（月视图）
    dayCell: {
      width: '14.28%', // 7分之1宽度（一周7天）
      height: 60, // 固定高度
      justifyContent: 'center', // 垂直居中
      alignItems: 'center', // 水平居中
      marginBottom: theme.spacing.xs, // 底部外边距
      position: 'relative', // 相对定位，用于子元素绝对定位
    },
    // 日期单元格内容容器
    dayCellContent: {
      alignItems: 'center', // 水平居中
      justifyContent: 'center', // 垂直居中
      height: '100%', // 占满父容器高度
      width: '100%', // 占满父容器宽度
    },
    // 日期上的心情图标（月视图）
    dayMoodIcon: {
      fontSize: 19, // 小字号表情
      marginBottom: 1, // 底部外边距
      height: 25, // 固定高度
      textAlign: 'center', // 居中对齐
      lineHeight: 25, // 行高与高度一致
    },
    // 日期数字样式
    dayNumber: {
      fontSize: 19, // 中等字号
      fontWeight: '500', // 中等字体权重
      color: theme.colors.text, // 主题文本颜色
      textAlign: 'center', // 居中对齐
    },
    // 非当前月份的日期数字样式
    dayNumberInactive: {
      color: theme.colors.textSecondary, // 次要文本颜色
      opacity: 0.5, // 半透明效果
    },
    // 今天的日期数字样式
    dayNumberToday: {
      backgroundColor: theme.colors.primary, // 主题色背景
      color: theme.colors.buttonText, // 按钮文本颜色
      borderRadius: 16, // 圆形背景
      width: 32, // 固定宽度
      height: 32, // 固定高度
      textAlign: 'center', // 居中对齐
      lineHeight: 32, // 行高与高度一致实现垂直居中
      fontWeight: '700', // 粗体
    },
    // === 周视图相关样式 ===
    // 周视图容器
    weekView: {
      flexDirection: 'row', // 水平排列7天
      justifyContent: 'space-between', // 两端对齐
    },
    // 周视图日期单元格
    weekDayCell: {
      flex: 1, // 平均分配宽度
      height: 75, // 固定高度
      justifyContent: 'center', // 垂直居中
      alignItems: 'center', // 水平居中
      borderRadius: theme.borderRadius.sm, // 小圆角
      marginHorizontal: 2, // 水平外边距
      position: 'relative', // 相对定位
    },
    weekDayCellContent: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
    },
    // 周视图日期上的心情图标
    weekDayMoodIcon: {
      fontSize: 14, // 中等字号表情
      marginBottom: 2, // 底部外边距
      height: 18, // 固定高度
      textAlign: 'center', // 居中对齐
      lineHeight: 18, // 行高与高度一致
    },
    // 周视图日期数字
    weekDayNumber: {
      fontSize: 16, // 中等字号
      fontWeight: '600', // 半粗体
      color: theme.colors.text, // 主题文本颜色
      textAlign: 'center', // 居中对齐
    },
    // === 心情选择相关样式 ===
    // 已选择心情显示区域
    selectedMoodDisplay: {
      flexDirection: 'row', // 水平排列
      alignItems: 'center', // 垂直居中
      backgroundColor: theme.colors.surface, // 表面颜色
      borderRadius: theme.borderRadius.lg, // 大圆角
      padding: theme.spacing.md, // 内边距
      marginBottom: theme.spacing.md, // 底部外边距
    },
    // 已选择心情的表情符号
    selectedMoodEmoji: {
      fontSize: 24, // 较大字号表情
      marginRight: theme.spacing.sm, // 右侧外边距
    },
    // 已选择心情的文本
    selectedMoodText: {
      fontSize: 16, // 中等字号
      fontWeight: '600', // 半粗体
      color: theme.colors.text, // 主题文本颜色
    },
    // === 心情选择轮盘相关样式 ===
    // 轮盘覆盖层（全屏遮罩）
    wheelOverlay: {
      position: 'absolute', // 绝对定位
      top: 0, // 顶部对齐
      left: 0, // 左侧对齐
      right: 0, // 右侧对齐
      bottom: 0, // 底部对齐
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色遮罩
      justifyContent: 'center', // 垂直居中
      alignItems: 'center', // 水平居中
      zIndex: 1000, // 最高层级
    },
    // 轮盘主容器
    wheelContainer: {
      width: 280, // 固定宽度
      height: 280, // 固定高度
      justifyContent: 'center', // 垂直居中
      alignItems: 'center', // 水平居中
      position: 'relative', // 相对定位
    },
    // 轮盘中心圆形按钮
    wheelCenter: {
      width: 80, // 固定宽度
      height: 80, // 固定高度
      borderRadius: 40, // 圆形（半径为宽高的一半）
      backgroundColor: theme.colors.surface, // 表面颜色背景
      justifyContent: 'center', // 垂直居中
      alignItems: 'center', // 水平居中
      // 阴影效果
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8, // Android阴影
      zIndex: 10, // 高层级确保在心情选项之上
    },
    // 轮盘中心文本
    wheelCenterText: {
      fontSize: 12, // 小字号
      fontWeight: '600', // 半粗体
      color: theme.colors.text, // 主题文本颜色
      textAlign: 'center', // 居中对齐
    },
    // 轮盘上的心情选项按钮
    moodWheelItem: {
      position: 'absolute', // 绝对定位（相对于轮盘容器）
      width: 60, // 固定宽度
      height: 60, // 固定高度
      borderRadius: 30, // 圆形（半径为宽高的一半）
      justifyContent: 'center', // 垂直居中
      alignItems: 'center', // 水平居中
      // 阴影效果
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4, // Android阴影
    },
    // 轮盘心情选项的表情符号
    moodWheelEmoji: {
      fontSize: 24, // 较大字号表情
    },
    // 轮盘心情选项的标签文本
    moodWheelLabel: {
      fontSize: 10, // 小字号
      fontWeight: '600', // 半粗体
      color: '#FFFFFF', // 白色文本（在彩色背景上显示）
      marginTop: 2, // 顶部外边距
      textAlign: 'center', // 居中对齐
    },

    // === 悬浮心情记录按钮样式 ===
    // 悬浮圆形按钮（左下角）
    floatingMoodButton: {
      position: 'absolute', // 绝对定位
      left: 20, // 距离左边20像素
      bottom: 30, // 距离底部30像素
      width: 60, // 固定宽度
      height: 60, // 固定高度
      borderRadius: 30, // 圆形（半径为宽高的一半）
      backgroundColor: theme.colors.primary, // 主题色背景
      justifyContent: 'center', // 垂直居中
      alignItems: 'center', // 水平居中
      // 阴影效果
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8, // Android阴影
      zIndex: 999, // 高层级确保在其他元素之上
    },
    // 悬浮按钮内部容器
    floatingMoodButtonInner: {
      width: '100%', // 占满父容器
      height: '100%', // 占满父容器
      borderRadius: 30, // 圆形（半径为宽高的一半）
      justifyContent: 'center', // 垂直居中
      alignItems: 'center', // 水平居中
    },
    // 悬浮按钮文本（表情符号）
    floatingMoodButtonText: {
      fontSize: 24, // 较大字号表情
      color: theme.colors.buttonText, // 按钮文本颜色
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.headerTitle}>你好！</Text>
        <Text style={styles.headerSubtitle}>今天的心情如何？</Text>
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* 日历区域 */}
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>
                {calendarView === 'month'
                  ? `${currentDate.getFullYear()}年 ${getMonthName(currentDate)} `
                  : `${currentDate.getFullYear()}年 ${getMonthName(currentDate)} 第${Math.ceil(currentDate.getDate() / 7)} 周`
                }
              </Text>
              <TouchableOpacity
                style={styles.viewToggleButton}
                onPress={toggleCalendarView}
                activeOpacity={0.8}
              >
                <Text style={styles.viewToggleText}>
                  {calendarView === 'month' ? '周视图' : '月视图'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 导航按钮 */}
            <View style={styles.calendarNavigation}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={navigatePrevious}
                activeOpacity={0.7}
              >
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.todayButton}
                onPress={goToToday}
                activeOpacity={0.7}
              >
                <Text style={styles.todayButtonText}>今天</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={navigateNext}
                activeOpacity={0.7}
              >
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* 星期标题 - 只在月视图显示 */}
            {calendarView === 'month' && (
              <View style={styles.weekDayHeader}>
                {getWeekDayNames().map((dayName, index) => (
                  <Text key={index} style={styles.weekDayName}>
                    {dayName}
                  </Text>
                ))}
              </View>
            )}

            {/* 日历内容 */}
            <Animated.View
              style={{
                opacity: calendarOpacity,
                transform: [{ scale: calendarScale }],
              }}
            >
              {calendarView === 'month' ? (
                <View style={styles.calendarGrid}>
                  {getMonthDays(currentDate).map((date, index) => {
                    const dateInfo = formatDate(date);
                    const dayMood = getMoodForDate(date);
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.dayCell}
                        onPress={() => setCurrentDate(date)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.dayCellContent}>
                          <Text style={styles.dayMoodIcon}>
                            {dayMood ? dayMood.emoji : ''}
                          </Text>
                          <Text
                            style={[
                              styles.dayNumber,
                              !dateInfo.isCurrentMonth && styles.dayNumberInactive,
                              dateInfo.isToday && styles.dayNumberToday,
                            ]}
                          >
                            {dateInfo.day}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View>
                  {/* 周视图星期标题 */}
                  <View style={styles.weekDayHeader}>
                    {getWeekDayNames().map((dayName, index) => (
                      <Text key={index} style={styles.weekDayName}>
                        {dayName}
                      </Text>
                    ))}
                  </View>

                  {/* 周视图日期 */}
                  <View style={styles.weekView}>
                    {getWeekDays(currentDate).map((date, index) => {
                      const dateInfo = formatDate(date);
                      const dayMood = getMoodForDate(date);
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.weekDayCell}
                          onPress={() => setCurrentDate(date)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.weekDayCellContent}>
                            <Text style={styles.weekDayMoodIcon}>
                              {dayMood ? dayMood.emoji : ''}
                            </Text>
                            <Text
                              style={[
                                styles.weekDayNumber,
                                dateInfo.isToday && styles.dayNumberToday,
                              ]}
                            >
                              {dateInfo.day}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </Animated.View>
          </View>

          {/* 已选择的心情显示 */}
          {selectedMood && (
            <View style={styles.selectedMoodDisplay}>
              <Text style={styles.selectedMoodEmoji}>
                {moodOptions.find(mood => mood.label === selectedMood)?.emoji}
              </Text>
              <Text style={styles.selectedMoodText}>
                当前心情：{selectedMood}
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>快捷操作</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onNavigateToDiaryList}>
              <Text style={styles.actionButtonText}>📝 写心情日记</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>📊 查看心情统计</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>🎯 设置心情目标</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* 悬浮心情记录按钮 */}
      <Animated.View
        style={[
          styles.floatingMoodButton,
          {
            opacity: buttonOpacity,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.floatingMoodButtonInner}
          onPress={openMoodWheel}
          activeOpacity={0.8}
        >
          <Text style={styles.floatingMoodButtonText}>📝</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* 心情选择圆盘 */}
      {isMoodWheelVisible && (
        <Animated.View
          style={[
            styles.wheelOverlay,
            {
              opacity: wheelOpacity,
            }
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={closeMoodWheel}
            activeOpacity={1}
          />

          <Animated.View
            style={[
              styles.wheelContainer,
              {
                transform: [
                  { scale: wheelScale },
                  { translateX: wheelTranslateX },
                  { translateY: wheelTranslateY }
                ]
              }
            ]}
          >
            {/* 圆盘中心 */}
            <TouchableOpacity
              style={styles.wheelCenter}
              onPress={closeMoodWheel}
              activeOpacity={0.8}
            >
              <Text style={styles.wheelCenterText}>选择{"\n"}心情</Text>
            </TouchableOpacity>

            {/* 心情选项 */}
            {moodOptions.map((mood, index) => {
              const position = getMoodPosition(index, moodOptions.length, 125);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.moodWheelItem,
                    {
                      backgroundColor: mood.color,
                      left: 140 + position.x - 30, // 减去一半宽度居中
                      top: 140 + position.y - 30,  // 减去一半高度居中
                    }
                  ]}
                  onPress={() => {
                    handleMoodSelect(mood.label);
                    closeMoodWheel();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moodWheelEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodWheelLabel}>{mood.label}</Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;