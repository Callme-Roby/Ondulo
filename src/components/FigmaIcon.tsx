import React from 'react';
import { StyleProp, ImageStyle } from 'react-native';
import { Image } from 'expo-image';
import { FigmaAssets, FigmaAssetName } from '../assets/figma';

interface FigmaIconProps {
  name: FigmaAssetName;
  /** Multiplies the design size (used by the bigger blobs). */
  scale?: number;
  style?: StyleProp<ImageStyle>;
}

/** Renders a Figma asset at its design size. */
export default function FigmaIcon({ name, scale = 1, style }: FigmaIconProps) {
  const asset = FigmaAssets[name];
  return (
    <Image
      source={asset.source}
      style={[{ width: asset.width * scale, height: asset.height * scale }, style]}
      contentFit="contain"
      accessible={false}
    />
  );
}
