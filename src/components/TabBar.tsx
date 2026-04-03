import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Colors, Fonts } from '../constants/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_ICONS: Record<string, (active: boolean) => React.ReactNode> = {
  Accueil: (active) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"
        stroke={active ? Colors.tabTextActive : Colors.tabText}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  ),
  'Mini Moi': (active) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={active ? Colors.tabTextActive : Colors.tabText}
        strokeWidth="1.8"
      />
      <Circle cx="9" cy="10" r="1.2" fill={active ? Colors.tabTextActive : Colors.tabText} />
      <Circle cx="15" cy="10" r="1.2" fill={active ? Colors.tabTextActive : Colors.tabText} />
      <Path
        d="M9 15c1 1.5 5 1.5 6 0"
        stroke={active ? Colors.tabTextActive : Colors.tabText}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  ),
  Boutique: (active) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 2L3 7v13a1 1 0 001 1h16a1 1 0 001-1V7l-3-5H6z"
        stroke={active ? Colors.tabTextActive : Colors.tabText}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M3 7h18"
        stroke={active ? Colors.tabTextActive : Colors.tabText}
        strokeWidth="1.8"
      />
      <Path
        d="M16 11a4 4 0 01-8 0"
        stroke={active ? Colors.tabTextActive : Colors.tabText}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  ),
  Amis: (active) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
        stroke={active ? Colors.tabTextActive : Colors.tabText}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle
        cx="9"
        cy="7"
        r="4"
        stroke={active ? Colors.tabTextActive : Colors.tabText}
        strokeWidth="1.8"
      />
      <Path
        d="M23 21v-2a4 4 0 00-3-3.87"
        stroke={active ? Colors.tabTextActive : Colors.tabText}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M16 3.13a4 4 0 010 7.75"
        stroke={active ? Colors.tabTextActive : Colors.tabText}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  ),
};

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={[styles.tab, isFocused && styles.tabActive]}
            >
              {TAB_ICONS[label]?.(isFocused)}
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: Colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBarBg,
    borderRadius: 28,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 22,
    gap: 4,
  },
  tabActive: {
    backgroundColor: Colors.tabActive,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: Fonts.semiBold,
    color: Colors.tabText,
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: Colors.tabTextActive,
    fontWeight: Fonts.bold,
  },
});
