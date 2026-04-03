import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Fonts } from '../constants/theme';
import { Mission } from '../constants/missions';
import MissionIcon from './MissionIcon';

interface MissionCardProps {
  mission: Mission;
  onToggle: (id: string) => void;
}

function CheckMark({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <View style={styles.checkCircleFilled}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 12l4 4 8-8"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  }
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Circle cx="16" cy="16" r="14" stroke={Colors.checkGray} strokeWidth="2" fill="none" />
    </Svg>
  );
}

export default function MissionCard({ mission, onToggle }: MissionCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onToggle(mission.id)}
    >
      <MissionIcon type={mission.icon} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, mission.completed && styles.titleCompleted]}>
          {mission.title}
        </Text>
        <Text style={[styles.subtitle, mission.completed && styles.subtitleCompleted]}>
          {mission.subtitle}
        </Text>
      </View>
      <CheckMark checked={mission.completed} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: Fonts.semiBold,
    color: Colors.textDark,
  },
  titleCompleted: {
    color: Colors.textLight,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMedium,
    marginTop: 2,
  },
  subtitleCompleted: {
    color: Colors.textLight,
  },
  checkCircleFilled: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.checkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
