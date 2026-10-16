import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ScreenBackground from '../../components/ScreenBackground';
import BillyBlob from '../../components/BillyBlob';
import { HeaderWave } from './HeaderWave';
import { launchTextStyle } from './SplashScreen';

const TRANSITION_MS = 950;

/** "Cliquez sur le blob pour commencer": Billy stretches up and becomes the chat header. */
export default function LaunchScreen({ onDone }: { onDone: () => void }) {
  const [size, setSize] = useState({ width: 390, height: 844 });
  const { height } = size;
  const [started, setStarted] = useState(false);
  const progress = useSharedValue(0);

  const start = () => {
    if (started) return;
    setStarted(true);
    progress.value = withTiming(
      1,
      { duration: TRANSITION_MS, easing: Easing.inOut(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(onDone)();
      }
    );
  };

  const blobStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.65, 0.9], [1, 1, 0]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -height / 2]) },
      { scaleY: interpolate(progress.value, [0, 0.6, 1], [1, 2.6, 1.4]) },
      { scaleX: interpolate(progress.value, [0, 0.6, 1], [1, 0.75, 3]) },
    ],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.55, 1], [0, 1], 'clamp'),
    transform: [{ translateY: interpolate(progress.value, [0.55, 1], [-120, 0], 'clamp') }],
  }));

  const hintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.3], [0.6, 0], 'clamp'),
  }));

  return (
    <Animated.View
      style={styles.root}
      entering={FadeIn.duration(400)}
      onLayout={(e) => setSize(e.nativeEvent.layout)}
    >
      <ScreenBackground flat />
      <Animated.View style={[StyleSheet.absoluteFill, waveStyle]} pointerEvents="none">
        <HeaderWave width={size.width} />
      </Animated.View>
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View style={blobStyle}>
          <Pressable
            onPress={start}
            accessibilityRole="button"
            aria-label="Toucher Billy pour commencer"
          >
            <BillyBlob asset="blobLaunch" period={2.8} />
          </Pressable>
        </Animated.View>
      </View>
      <Animated.View style={[styles.hintBox, hintStyle]} pointerEvents="none">
        <Text style={launchTextStyle}>Cliquez sur le blob pour commencer</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBox: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 54,
  },
});
