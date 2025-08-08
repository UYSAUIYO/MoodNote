import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

// 主页图标
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

// 统计图标
export const StatsIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          x="3"
          y="16"
          width="4"
          height="5"
          rx="1"
          fill={iconColor}
        />
        <Rect
          x="10"
          y="12"
          width="4"
          height="9"
          rx="1"
          fill={iconColor}
        />
        <Rect
          x="17"
          y="8"
          width="4"
          height="13"
          rx="1"
          fill={iconColor}
        />
      </Svg>
    </View>
  );
};

// 成就图标
export const AchievementIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill={iconColor}
        />
      </Svg>
    </View>
  );
};

// 个人资料图标
export const ProfileIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="12"
          cy="8"
          r="4"
          fill={iconColor}
        />
        <Path
          d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21"
          fill={iconColor}
        />
      </Svg>
    </View>
  );
};

// 设置图标
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12.22 2H11.78C11.2496 2 10.7409 2.21071 10.3658 2.58579C9.99072 2.96086 9.78 3.46957 9.78 4V4.18C9.77964 4.53073 9.68706 4.87519 9.51154 5.17884C9.33602 5.48248 9.08374 5.73464 8.78 5.91L8.35 6.16C8.04626 6.33552 7.70180 6.4281 7.35107 6.42846C7.00035 6.42882 6.65566 6.33694 6.35162 6.16213C6.04758 5.98732 5.79542 5.73504 5.6199 5.4313C5.44438 5.12755 5.35180 4.78309 5.35144 4.43237L5.35 4.25C5.35 3.71957 5.13929 3.21086 4.76421 2.83579C4.38914 2.46071 3.88043 2.25 3.35 2.25H2.65C2.11957 2.25 1.61086 2.46071 1.23579 2.83579C0.860714 3.21086 0.65 3.71957 0.65 4.25V4.75C0.65 5.28043 0.860714 5.78914 1.23579 6.16421C1.61086 6.53929 2.11957 6.75 2.65 6.75H2.83C3.18073 6.75036 3.52519 6.84294 3.82884 7.01846C4.13248 7.19398 4.38464 7.44626 4.56 7.75L4.81 8.18C4.98552 8.48374 5.0781 8.8282 5.07846 9.17893C5.07882 9.52965 4.98694 9.87434 4.81213 10.1784C4.63732 10.4824 4.38504 10.7346 4.0813 10.9101C3.77755 11.0856 3.43309 11.1782 3.08237 11.1786L2.9 11.18C2.36957 11.18 1.86086 11.3907 1.48579 11.7658C1.11071 12.1409 0.9 12.6496 0.9 13.18V13.82C0.9 14.3504 1.11071 14.8591 1.48579 15.2342C1.86086 15.6093 2.36957 15.82 2.9 15.82H3.08C3.43073 15.8204 3.77519 15.9129 4.07884 16.0885C4.38248 16.264 4.63464 16.5163 4.81 16.82L5.06 17.25C5.23552 17.5537 5.3281 17.8982 5.32846 18.2489C5.32882 18.5997 5.23694 18.9443 5.06213 19.2484C4.88732 19.5524 4.63504 19.8046 4.3313 19.9801C4.02755 20.1556 3.68309 20.2482 3.33237 20.2486L3.15 20.25C2.61957 20.25 2.11086 20.4607 1.73579 20.8358C1.36071 21.2109 1.15 21.7196 1.15 22.25V22.75C1.15 23.2804 1.36071 23.7891 1.73579 24.1642C2.11086 24.5393 2.61957 24.75 3.15 24.75H3.65C4.18043 24.75 4.68914 24.5393 5.06421 24.1642C5.43929 23.7891 5.65 23.2804 5.65 22.75V22.57C5.65036 22.2193 5.74294 21.8748 5.91846 21.5712C6.09398 21.2675 6.34626 21.0154 6.65 20.84L7.08 20.59C7.38374 20.4145 7.7282 20.3219 8.07893 20.3215C8.42965 20.3212 8.77434 20.4131 9.07838 20.5879C9.38242 20.7627 9.6347 21.015 9.81022 21.3187C9.98574 21.6225 10.0783 21.9669 10.0787 22.3176L10.08 22.5C10.08 23.0304 10.2907 23.5391 10.6658 23.9142C11.0409 24.2893 11.5496 24.5 12.08 24.5H12.92C13.4504 24.5 13.9591 24.2893 14.3342 23.9142C14.7093 23.5391 14.92 23.0304 14.92 22.5V22.32C14.9204 21.9693 15.0129 21.6248 15.1885 21.3212C15.364 21.0175 15.6163 20.7654 15.92 20.59L16.35 20.34C16.6537 20.1645 16.9982 20.0719 17.3489 20.0715C17.6997 20.0712 18.0443 20.1631 18.3484 20.3379C18.6524 20.5127 18.9046 20.765 19.0801 21.0687C19.2556 21.3725 19.3482 21.7169 19.3486 22.0676L19.35 22.25C19.35 22.7804 19.5607 23.2891 19.9358 23.6642C20.3109 24.0393 20.8196 24.25 21.35 24.25H21.85C22.3804 24.25 22.8891 24.0393 23.2642 23.6642C23.6393 23.2891 23.85 22.7804 23.85 22.25V21.75C23.85 21.2196 23.6393 20.7109 23.2642 20.3358C22.8891 19.9607 22.3804 19.75 21.85 19.75H21.67C21.3193 19.7496 20.9748 19.6571 20.6712 19.4815C20.3675 19.306 20.1154 19.0537 19.94 18.75L19.69 18.32C19.5145 18.0163 19.4219 17.6718 19.4215 17.3211C19.4212 16.9703 19.5131 16.6257 19.6879 16.3216C19.8627 16.0176 20.115 15.7653 20.4187 15.5898C20.7225 15.4143 21.0669 15.3217 21.4176 15.3214L21.6 15.32C22.1304 15.32 22.6391 15.1093 23.0142 14.7342C23.3893 14.3591 23.6 13.8504 23.6 13.32V12.68C23.6 12.1496 23.3893 11.6409 23.0142 11.2658C22.6391 10.8907 22.1304 10.68 21.6 10.68H21.42C21.0693 10.6796 20.7248 10.5871 20.4212 10.4115C20.1175 10.236 19.8654 9.98374 19.69 9.68L19.44 9.25C19.2645 8.94626 19.1719 8.6018 19.1715 8.25107C19.1712 7.90035 19.2631 7.55566 19.4379 7.25162C19.6127 6.94758 19.865 6.6953 20.1687 6.51978C20.4725 6.34426 20.8169 6.25168 21.1676 6.25132L21.35 6.25C21.8804 6.25 22.3891 6.03929 22.7642 5.66421C23.1393 5.28914 23.35 4.78043 23.35 4.25V3.75C23.35 3.21957 23.1393 2.71086 22.7642 2.33579C22.3891 1.96071 21.8804 1.75 21.35 1.75H20.85C20.3196 1.75 19.8109 1.96071 19.4358 2.33579C19.0607 2.71086 18.85 3.21957 18.85 3.75V3.93C18.8496 4.28073 18.7571 4.62519 18.5815 4.92884C18.406 5.23248 18.1537 5.48464 17.85 5.66L17.42 5.91C17.1163 6.08552 16.7718 6.1781 16.4211 6.17846C16.0703 6.17882 15.7257 6.08694 15.4216 5.91213C15.1176 5.73732 14.8653 5.48504 14.6898 5.1813C14.5143 4.87755 14.4217 4.53309 14.4214 4.18237L14.42 4C14.42 3.46957 14.2093 2.96086 13.8342 2.58579C13.4591 2.21071 12.9504 2 12.42 2H12.22Z"
          fill={iconColor}
        />
        <Circle
          cx="12"
          cy="12"
          r="3"
          fill={theme.colors.background}
        />
      </Svg>
    </View>
  );
};

// 返回箭头图标
export const BackIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// 筛选图标
export const FilterIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4C21 4.55228 20.5523 5 20 5H4C3.44772 5 3 4.55228 3 4Z"
          fill={iconColor}
        />
        <Path
          d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
          fill={iconColor}
        />
        <Path
          d="M9 20C9 19.4477 9.44772 19 10 19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H10C9.44772 21 9 20.5523 9 20Z"
          fill={iconColor}
        />
      </Svg>
    </View>
  );
};

// 搜索图标
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="11"
          cy="11"
          r="8"
          stroke={iconColor}
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M21 21L16.65 16.65"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// 编辑图标
export const EditIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

// 保存图标
export const SaveIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M17 21V13H7V21"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M7 3V8H15"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

// 主题切换图标
export const ThemeIcon: React.FC<IconProps & { isDark: boolean }> = ({ size = 24, color, style, isDark }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  if (isDark) {
    // 月亮图标
    return (
      <View style={[{ width: size, height: size }, style]}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1583 17.4668C18.1127 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.7473 21.1181 10.0713 20.746C8.39524 20.3739 6.84947 19.5345 5.63604 18.3211C4.42261 17.1077 3.58325 15.5619 3.21116 13.8859C2.83907 12.2099 2.94987 10.4693 3.53064 8.86147C4.11141 7.25367 5.13807 5.84447 6.49044 4.79887C7.84281 3.75328 9.46499 3.11445 11.167 2.957C10.5078 4.06713 10.2156 5.35061 10.3266 6.63228C10.4375 7.91396 10.9462 9.13077 11.7926 10.1353C12.6391 11.1398 13.7844 11.8882 15.0769 12.2923C16.3694 12.6965 17.7505 12.7398 19.0667 12.4167C19.6848 12.2764 20.2717 12.0225 20.8 11.67C20.9333 12.0533 21 12.4267 21 12.79Z"
            fill={iconColor}
          />
        </Svg>
      </View>
    );
  } else {
    // 太阳图标
    return (
      <View style={[{ width: size, height: size }, style]}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle
            cx="12"
            cy="12"
            r="5"
            fill={iconColor}
          />
          <Path
            d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </View>
    );
  }
};

// 写日记图标
export const DiaryIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M14 2V8H20"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M16 13H8"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 17H8"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M10 9H9H8"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// 目标图标
export const TargetIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="12"
          cy="12"
          r="10"
          stroke={iconColor}
          strokeWidth="2"
          fill="none"
        />
        <Circle
          cx="12"
          cy="12"
          r="6"
          stroke={iconColor}
          strokeWidth="2"
          fill="none"
        />
        <Circle
          cx="12"
          cy="12"
          r="2"
          fill={iconColor}
        />
      </Svg>
    </View>
  );
};

// 信息图标
export const InfoIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="12"
          cy="12"
          r="10"
          stroke={iconColor}
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M12 16V12"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12 8H12.01"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// 通知图标
export const NotificationIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// 时钟/提醒图标
export const ClockIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="12"
          cy="12"
          r="10"
          stroke={iconColor}
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M12 6V12L16 14"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// 反馈/聊天图标
export const FeedbackIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

// 隐私/锁图标
export const PrivacyIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          x="3"
          y="11"
          width="18"
          height="11"
          rx="2"
          ry="2"
          stroke={iconColor}
          strokeWidth="2"
          fill="none"
        />
        <Circle
          cx="12"
          cy="16"
          r="1"
          fill={iconColor}
        />
        <Path
          d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// 云图标
export const CloudIcon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;
  
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M18 10H16.74C16.24 7.67 14.24 6 11.99 6C10.9 6 9.89 6.37 9.09 7.03C7.85 7.84 7.06 9.18 7.06 10.65C7.06 10.76 7.07 10.87 7.08 10.98C4.85 11.33 3.18 13.26 3.18 15.58C3.18 18.14 5.32 20.28 7.88 20.28H18C20.21 20.28 22 18.49 22 16.28C22 14.18 20.4 12.5 18.38 12.28C18.25 11.96 18.13 11.64 18 10Z"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};