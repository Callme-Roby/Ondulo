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

interface BlobProps {
  /** 0 to 1 — proportion of missions completed */
  completionRatio: number;
}

const BASE_SIZE = 160;
const MAX_SIZE = 280;

export default function Blob({ completionRatio }: BlobProps) {
  const morphProgress = useSharedValue(0);

  useEffect(() => {
    morphProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  // Blob grows from BASE_SIZE to MAX_SIZE based on completion
  const blobSize = BASE_SIZE + (MAX_SIZE - BASE_SIZE) * completionRatio;
  // Opacity goes from 0.5 to 1
  const blobOpacity = 0.5 + completionRatio * 0.5;
  // Saturation: simulated via desaturation overlay opacity
  const desaturationOpacity = Math.max(0, 0.7 - completionRatio * 0.85);
  // Face opacity
  const faceOpacity = 0.3 + completionRatio * 0.7;

  const animatedBlobStyle = useAnimatedStyle(() => {
    const br1 = interpolate(morphProgress.value, [0, 1], [60, 30]);
    const br2 = interpolate(morphProgress.value, [0, 1], [40, 60]);
    const br3 = interpolate(morphProgress.value, [0, 1], [30, 70]);
    const br4 = interpolate(morphProgress.value, [0, 1], [70, 40]);

    return {
      borderTopLeftRadius: (br1 / 100) * blobSize,
      borderTopRightRadius: (br2 / 100) * blobSize,
      borderBottomRightRadius: (br3 / 100) * blobSize,
      borderBottomLeftRadius: (br4 / 100) * blobSize,
    };
  });

  return (
    <View style={styles.container}>
      {/* Soft glow behind blob */}
      <View
        style={[
          styles.glow,
          {
            width: blobSize * 1.4,
            height: blobSize * 1.4,
            borderRadius: blobSize * 0.7,
            opacity: 0.08 + completionRatio * 0.12,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            width: blobSize,
            height: blobSize,
            opacity: blobOpacity,
          },
          animatedBlobStyle,
        ]}
      >
        {/* Gradient background */}
        <LinearGradient
          colors={['#D5FFB3', '#94F6FF', '#FF9EF2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        {/* Desaturated overlay — fades out as completion increases */}
        <View
          style={[
            styles.desaturateOverlay,
            { opacity: desaturationOpacity },
          ]}
        />
        {/* Face SVG */}
        <Svg
          width={blobSize * 0.38}
          height={blobSize * 0.38}
          viewBox="0 0 100 100"
          style={{ opacity: faceOpacity }}
        >
          <Circle cx="35" cy="45" r="5" fill="white" />
          <Circle cx="65" cy="45" r="5" fill="white" />
          <Path
            d="M 35 65 Q 50 80 65 65"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  glow: {
    position: 'absolute',
    backgroundColor: '#B0E8F0',
  },
  blob: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  desaturateOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E0E4E8',
  },
});
