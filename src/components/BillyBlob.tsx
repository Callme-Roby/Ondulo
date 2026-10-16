import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import FigmaIcon from './FigmaIcon';
import { FigmaAssetName } from '../assets/figma';

interface BillyBlobProps {
  asset: FigmaAssetName;
  /** Size multiplier applied to the design size. */
  scale?: number;
  /** 0 → tired (smaller, faded), 1 → full of energy. */
  energy?: number;
  /** Seconds of one breath; Billy breathes slower when tired. */
  period?: number;
  style?: StyleProp<ViewStyle>;
}

/** Billy, breathing and floating gently. */
export default function BillyBlob({
  asset,
  scale = 1,
  energy = 1,
  period = 3.2,
  style,
}: BillyBlobProps) {
  const breath = useSharedValue(0);

  useEffect(() => {
    breath.value = withRepeat(
      withTiming(1, { duration: period * 1000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [period]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(breath.value, [0, 1], [0, -6]) },
      { scale: interpolate(breath.value, [0, 1], [1, 1.035]) },
      { rotate: `${interpolate(breath.value, [0, 1], [-2.5, 2.5])}deg` },
    ],
  }));

  const size = 0.82 + 0.18 * energy;
  return (
    <Animated.View style={[{ opacity: 0.55 + 0.45 * energy }, animatedStyle, style]}>
      <FigmaIcon name={asset} scale={scale * size} />
    </Animated.View>
  );
}
