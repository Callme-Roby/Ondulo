import React, { useEffect, useId, useMemo } from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, G, Path, RadialGradient, Stop } from 'react-native-svg';
import * as Blobs from '../assets/blobs';
import { BlobGradient, blobPath, wobbleFor } from './blobShape';
import { Colors } from '../constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type BlobName = keyof typeof Blobs;

interface BillyBlobProps {
  asset: BlobName;
  /** Size multiplier applied to the design size. */
  scale?: number;
  /** 0 → tired (smaller, faded, calmer), 1 → full of energy. */
  energy?: number;
  /** Seconds of one breath; Billy breathes slower when tired. */
  period?: number;
  style?: StyleProp<ViewStyle>;
}

function Gradient({ id, gradient }: { id: string; gradient: BlobGradient }) {
  return (
    <RadialGradient
      id={id}
      cx="0"
      cy="0"
      r="1"
      gradientUnits="userSpaceOnUse"
      gradientTransform={`matrix(${gradient.matrix.join(' ')})`}
    >
      {gradient.stops.map(([offset, color]) => (
        <Stop key={offset} offset={offset} stopColor={color} />
      ))}
    </RadialGradient>
  );
}

/** Billy, from the Figma outline: his edge ripples while he breathes and floats. */
export default function BillyBlob({
  asset,
  scale = 1,
  energy = 1,
  period = 3.2,
  style,
}: BillyBlobProps) {
  const shape = Blobs[asset];
  const wobble = useMemo(() => wobbleFor(shape), [shape]);
  const gradientId = `billy-${useId().replace(/:/g, '')}`;
  const breath = useSharedValue(0);
  const clock = useSharedValue(0);

  useEffect(() => {
    breath.value = withRepeat(
      withTiming(1, { duration: period * 1000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    clock.value = 0;
    clock.value = withRepeat(
      withTiming(2 * Math.PI, { duration: period * 2600, easing: Easing.linear }),
      -1,
      false
    );
  }, [period]);

  const amplitude = Math.min(shape.width, shape.height) * (0.012 + 0.018 * energy);
  const { start, segments } = shape;
  const outline = useAnimatedProps(() => ({
    d: blobPath(start, segments, wobble, clock.value, amplitude),
  }));

  // Optional second outline over the body, rippling on its own
  const overlay = shape.overlays?.[0];
  const overlayStart = overlay?.start ?? start;
  const overlaySegments = overlay?.segments ?? segments;
  const overlayWobble = useMemo(
    () => (overlay ? wobbleFor({ ...shape, start: overlay.start, segments: overlay.segments }) : wobble),
    [shape, overlay, wobble]
  );
  const overlayOutline = useAnimatedProps(() => ({
    d: blobPath(overlayStart, overlaySegments, overlayWobble, clock.value, amplitude),
  }));

  // Soft squash and stretch: a jelly breath rather than a rigid zoom
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(breath.value, [0, 1], [0, -6 * scale]) },
      { scaleX: interpolate(breath.value, [0, 1], [1.015, 0.985]) },
      { scaleY: interpolate(breath.value, [0, 1], [0.98, 1.03]) },
    ],
  }));

  const size = scale * (0.82 + 0.18 * energy);
  const top = shape.layers[shape.layers.length - 1];
  const paint = shape.stroke ?? top;
  const initial = blobPath(start, segments, wobble, 0, amplitude);

  return (
    <Animated.View
      style={[{ opacity: 0.55 + 0.45 * energy }, shadowStyle(shape.shadow, size), animatedStyle, style]}
    >
      <Svg
        width={shape.width * size}
        height={shape.height * size}
        viewBox={`0 0 ${shape.width} ${shape.height}`}
      >
        <Defs>
          {paint && <Gradient id={gradientId} gradient={paint} />}
          {overlay && <Gradient id={`${gradientId}-o`} gradient={overlay} />}
        </Defs>
        {shape.stroke ? (
          <AnimatedPath
            d={initial}
            animatedProps={outline}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={shape.stroke.width}
            strokeLinecap="round"
          />
        ) : (
          <>
            {shape.fill && shape.fill.opacity < 1 && (
              // Figma keeps the glow from showing behind Billy: an opaque "Light White"
              // base does the same, and the translucent layers blend on it as designed
              <AnimatedPath d={initial} animatedProps={outline} fill={Colors.lightWhite} />
            )}
            {shape.fill?.shadow && (
              // Seen through the translucent body; drawn flat (SVG filters are not portable)
              <AnimatedPath
                d={initial}
                animatedProps={outline}
                fill={`rgb(${shape.fill.shadow.rgba.slice(0, 3).join(', ')})`}
                fillOpacity={shape.fill.shadow.rgba[3]}
              />
            )}
            <AnimatedPath
              d={initial}
              animatedProps={outline}
              fill={shape.fill ? shape.fill.color : `url(#${gradientId})`}
              fillOpacity={shape.fill?.opacity}
            />
          </>
        )}
        {overlay && (
          <AnimatedPath
            d={blobPath(overlay.start, overlay.segments, overlayWobble, 0, amplitude)}
            animatedProps={overlayOutline}
            fill={`url(#${gradientId}-o)`}
            opacity={overlay.opacity}
          />
        )}
        <G>
          {shape.face.map((part) => (
            <Path
              key={part.d.slice(0, 24)}
              d={part.d}
              fill={part.fill}
              stroke={part.stroke}
              strokeWidth={part.strokeWidth}
              strokeLinecap={part.stroke ? 'round' : undefined}
              strokeLinejoin={part.stroke ? 'round' : undefined}
            />
          ))}
        </G>
      </Svg>
    </Animated.View>
  );
}

/** The design's drop shadow (SVG filters are not portable, so it is drawn by the view). */
function shadowStyle(shadow: (typeof Blobs)[BlobName]['shadow'], size: number): ViewStyle | null {
  if (!shadow) return null;
  const [r, g, b, a] = shadow.rgba;
  if (Platform.OS === 'web') {
    return { filter: `drop-shadow(0px 0px ${shadow.blur * size}px rgba(${r}, ${g}, ${b}, ${a}))` } as ViewStyle;
  }
  return {
    shadowColor: `rgb(${r}, ${g}, ${b})`,
    shadowOpacity: a,
    shadowRadius: shadow.blur * size,
    shadowOffset: { width: 0, height: 0 },
  };
}
