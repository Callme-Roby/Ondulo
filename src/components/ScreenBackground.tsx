import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Colors } from '../constants/theme';

interface ScreenBackgroundProps {
  /** Chat and launch screens use a flat light background instead of the gradient. */
  flat?: boolean;
}

/**
 * Shared screen background: soft diagonal gradient plus the two blurred glows of the
 * design (azure top right, violet left), drawn as radial gradients so they work on
 * every platform.
 */
export default function ScreenBackground({ flat = false }: ScreenBackgroundProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {flat ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.lightWhite }]} />
      ) : (
        <LinearGradient
          colors={['#F3F7FB', '#E3E9EE', '#F3F7FB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <RadialGradient id="glowAzure" cx="115%" cy="22%" r="75%" fx="115%" fy="22%">
            <Stop offset="0" stopColor={Colors.azure} stopOpacity={0.55} />
            <Stop offset="1" stopColor={Colors.azure} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="glowViolet" cx="-20%" cy="62%" r="70%" fx="-20%" fy="62%">
            <Stop offset="0" stopColor={Colors.lightViolet} stopOpacity={0.5} />
            <Stop offset="1" stopColor={Colors.lightViolet} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowAzure)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowViolet)" />
      </Svg>
    </View>
  );
}
