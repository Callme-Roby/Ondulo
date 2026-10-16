import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../constants/theme';

/** Small, always-colorful Billy used as the speaker in the onboarding chat. */
export default function BillyAvatar({ size = 72 }: { size?: number }) {
  const morph = useSharedValue(0);

  useEffect(() => {
    morph.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: interpolate(morph.value, [0, 1], [0.6, 0.35]) * size,
    borderTopRightRadius: interpolate(morph.value, [0, 1], [0.4, 0.6]) * size,
    borderBottomRightRadius: interpolate(morph.value, [0, 1], [0.35, 0.65]) * size,
    borderBottomLeftRadius: interpolate(morph.value, [0, 1], [0.65, 0.4]) * size,
  }));

  return (
    <Animated.View style={[styles.blob, { width: size, height: size }, animatedStyle]}>
      <LinearGradient
        colors={[Colors.blobGreen, Colors.blobCyan, Colors.blobPink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View>
        <Svg width={size * 0.42} height={size * 0.42} viewBox="0 0 100 100">
          <Circle cx="35" cy="45" r="6" fill="white" />
          <Circle cx="65" cy="45" r="6" fill="white" />
          <Path
            d="M 35 65 Q 50 80 65 65"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  blob: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
