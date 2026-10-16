import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';

const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;
// Below this width (phones, narrow iframes) the app fills the viewport.
const FRAME_BREAKPOINT = 600;
const BEZEL = 10;

/**
 * Web only: on wide screens, renders the app inside a centered phone-shaped
 * container so the mobile layout is preserved.
 */
export default function WebFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();

  if (width < FRAME_BREAKPOINT) {
    return <View style={styles.fill}>{children}</View>;
  }

  const margin = height < 760 ? 16 : 32;
  const frameHeight = Math.min(PHONE_HEIGHT, height - margin * 2);

  return (
    <LinearGradient
      colors={['#E9F7F4', Colors.background, '#F4EEFB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.backdrop}
    >
      <View style={[styles.phone, { height: frameHeight }]}>
        <View style={styles.screen}>{children}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    width: PHONE_WIDTH + BEZEL * 2,
    padding: BEZEL,
    borderRadius: 48,
    backgroundColor: Colors.white,
    boxShadow: '0 30px 80px rgba(27, 58, 92, 0.18), 0 8px 24px rgba(27, 58, 92, 0.08)',
  },
  screen: {
    flex: 1,
    // Stands in for the status bar area a real device would reserve.
    paddingTop: 12,
    borderRadius: 38,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
});
