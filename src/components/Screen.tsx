import React from 'react';
import { View, ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenBackground from './ScreenBackground';
import { TAB_BAR_SPACE } from './TabBar';
import { CONTENT_MAX_WIDTH, SCREEN_GUTTER } from '../constants/theme';

interface ScreenProps {
  header: React.ReactNode;
  children: React.ReactNode;
  /** Call to action pinned above the navigation bar. */
  footer?: React.ReactNode;
  /** false for screens shown outside the tabs (no navigation bar to clear). */
  withTabBar?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

const HEADER_SPACE = 96;
const FOOTER_SPACE = 48 + 24;

/** Layout shared by the app screens: background, floating header, scrollable content. */
export default function Screen({
  header,
  children,
  footer,
  withTabBar = true,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomSpace = (withTabBar ? TAB_BAR_SPACE : 24) + insets.bottom;

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: HEADER_SPACE + insets.top,
            paddingBottom: bottomSpace + (footer ? FOOTER_SPACE : 0),
          },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {footer && <View style={[styles.footer, { bottom: bottomSpace }]}>{footer}</View>}
      {header}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: SCREEN_GUTTER,
  },
  footer: {
    position: 'absolute',
    left: SCREEN_GUTTER,
    right: SCREEN_GUTTER,
    maxWidth: CONTENT_MAX_WIDTH - 2 * SCREEN_GUTTER,
    alignSelf: 'center',
  },
});
