import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import FigmaIcon from '../../components/FigmaIcon';

const DESIGN_WIDTH = 390;

/** Billy as a wave at the top of the chat (blob of the "Prise d'information" frames). */
export function HeaderWave({ width = DESIGN_WIDTH }: { width?: number }) {
  const ratio = Math.max(1, width / DESIGN_WIDTH);
  const sway = useSharedValue(0);

  useEffect(() => {
    sway.value = withRepeat(
      withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(sway.value, [0, 1], [-4, 3]) },
      { scaleX: interpolate(sway.value, [0, 1], [1, 1.02]) },
    ],
  }));

  // The clipping box keeps the oversized asset from making its parent scrollable
  // (on web, focusing the chat input would otherwise scroll the screen sideways).
  return (
    <View style={[styles.clip, { height: 160 * ratio }]} pointerEvents="none">
      <Animated.View style={[styles.wave, { top: -4 * ratio }, style]}>
        <FigmaIcon name="blobHeader" scale={ratio} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  // The export starts at the blob's own bounds; the extra top hides the sway
  wave: {
    position: 'absolute',
  },
});
