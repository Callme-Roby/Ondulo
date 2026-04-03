import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { Colors } from '../constants/theme';

interface MissionIconProps {
  type: 'movement' | 'hygiene' | 'meal';
}

const iconBgColors: Record<string, string> = {
  movement: Colors.missionIconBlue,
  hygiene: Colors.missionIconGreen,
  meal: Colors.missionIconPurple,
};

const iconStrokeColors: Record<string, string> = {
  movement: '#3B82C4',
  hygiene: '#34A87A',
  meal: '#8B5CF6',
};

export default function MissionIcon({ type }: MissionIconProps) {
  const bgColor = iconBgColors[type];
  const stroke = iconStrokeColors[type];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        {type === 'movement' && (
          <>
            {/* Walking person */}
            <Circle cx="12" cy="4" r="2" fill={stroke} />
            <Path
              d="M10 9h4l2 5h-2l-1 6h-2l-1-6H8z"
              fill={stroke}
            />
            <Line x1="8" y1="14" x2="10" y2="10" stroke={stroke} strokeWidth="1.5" />
            <Line x1="16" y1="14" x2="14" y2="10" stroke={stroke} strokeWidth="1.5" />
          </>
        )}
        {type === 'hygiene' && (
          <>
            {/* Soap/bottle */}
            <Rect x="8" y="8" width="8" height="12" rx="2" fill={stroke} opacity={0.8} />
            <Rect x="10" y="4" width="4" height="5" rx="1" fill={stroke} />
            <Path d="M10 11h4" stroke="white" strokeWidth="1" />
          </>
        )}
        {type === 'meal' && (
          <>
            {/* Fork and knife */}
            <Path d="M9 3v7c0 1.1-.9 2-2 2h0v9" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <Path d="M7 3v4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M9 3v4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M17 3c0 0-2 2-2 5s2 4 2 4v9" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
