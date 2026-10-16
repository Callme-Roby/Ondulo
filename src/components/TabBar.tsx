import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import FigmaIcon from './FigmaIcon';
import { FigmaAssetName } from '../assets/figma';
import { Colors, Fonts, Shadows } from '../constants/theme';

const TAB_ICONS: Record<string, { idle: FigmaAssetName; active: FigmaAssetName }> = {
  Accueil: { idle: 'navHome', active: 'navHomeActive' },
  'Mini Moi': { idle: 'navMinimoi', active: 'navMinimoiActive' },
  Boutique: { idle: 'navShop', active: 'navShopActive' },
  Défis: { idle: 'navDefis', active: 'navDefisActive' },
};

/** Height taken by the floating bar, for the bottom padding of the screens. */
export const TAB_BAR_SPACE = 8 + 81 + 24;

/** Floating frosted navigation bar ("navbar" component). */
export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container} pointerEvents="box-none">
      <LinearGradient
        colors={['rgba(228,234,239,0)', Colors.middleWhite]}
        style={[styles.fade, { height: 88 + insets.bottom }]}
        pointerEvents="none"
      />
      <View style={[styles.bar, { marginBottom: 8 + insets.bottom }]} accessibilityRole="tablist">
        <LinearGradient
          colors={['rgba(227,246,245,0.5)', 'rgba(238,241,248,0.5)', 'rgba(237,232,251,0.5)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const icons = TAB_ICONS[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              accessibilityRole="tab"
              aria-selected={focused}
              style={[styles.tab, focused && styles.tabActive]}
            >
              {icons && <FigmaIcon name={focused ? icons.active : icons.idle} />}
              <Text style={[styles.label, focused && styles.labelActive]}>{route.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    width: '100%',
    maxWidth: 374,
    flexDirection: 'row',
    gap: 4,
    padding: 12,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: Colors.white,
    overflow: 'hidden',
    ...Shadows.card,
  },
  tab: {
    flex: 1,
    height: 55,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.lightBlue,
  },
  label: {
    marginTop: 4,
    fontFamily: Fonts.interMedium,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.25,
    textTransform: 'uppercase',
    color: Colors.blueText,
  },
  labelActive: {
    color: Colors.blue,
  },
});
