import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FigmaIcon from './FigmaIcon';
import { FigmaAssetName } from '../assets/figma';
import { Colors, Fonts, Shadows, Type } from '../constants/theme';

/** Main call to action ("btn" in the design). */
export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      style={[styles.primaryButton, disabled && styles.disabled, style]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

/** Selectable pill used for tabs (Accessoires / Thèmes, Ingrédients / Étapes). */
export function Pill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="tab"
      aria-selected={selected}
      style={[styles.pill, selected ? styles.pillSelected : styles.pillIdle]}
    >
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

/** White pill with an icon and a short bold value (duration, difficulty, XP…). */
export function InfoTag({ icon, label }: { icon: FigmaAssetName; label: string }) {
  return (
    <View style={styles.infoTag}>
      <FigmaIcon name={icon} />
      <Text style={Type.smallBold}>{label}</Text>
    </View>
  );
}

/** Star balance shown in the shop header and on the Mini Moi page. */
export function StarCount({ value, style }: { value: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.starCount, style]} aria-label={`${value} étoiles`}>
      <View style={styles.starIconBox}>
        <FigmaIcon name="iconStar" />
      </View>
      <Text style={Type.smallBold}>{value}</Text>
    </View>
  );
}

/** Frosted card ("slot" in the design). */
export function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.glassCard, style]}>{children}</View>;
}

/** "JOUR n" pill, XP bar and caption. */
export function LevelProgress({
  day,
  xp,
  next,
  align = 'center',
}: {
  day: number;
  xp: number;
  next: number;
  align?: 'center' | 'left';
}) {
  const ratio = next > 0 ? Math.min(xp / next, 1) : 0;
  const centered = align === 'center';
  return (
    <View style={[styles.level, centered ? styles.levelCentered : styles.levelLeft]}>
      <View style={styles.dayPill}>
        <Text style={styles.dayText}>JOUR {day}</Text>
      </View>
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        aria-valuemin={0}
        aria-valuemax={next}
        aria-valuenow={xp}
      >
        <LinearGradient
          colors={[Colors.violet, Colors.sky]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.trackFill, { width: `${ratio * 100}%` }]}
        />
      </View>
      <Text style={[styles.levelCaption, centered && { textAlign: 'center' }]}>
        {xp} / {next} XP avant la prochaine évolution
      </Text>
    </View>
  );
}

const MISSION_ICONS = {
  mobility: 'missionMobility',
  hygiene: 'missionHygiene',
  meal: 'missionMeal',
} as const;

/** Daily mission row ("Mission" in the design). */
export function MissionRow({
  title,
  subtitle,
  icon,
  completed,
  highlighted = false,
  dimmed = false,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof MISSION_ICONS;
  completed: boolean;
  highlighted?: boolean;
  dimmed?: boolean;
  onPress?: () => void;
}) {
  const content = (
    <>
      <View style={styles.missionIcon}>
        <FigmaIcon name={MISSION_ICONS[icon]} />
      </View>
      <View style={styles.missionText}>
        <Text style={Type.cardTitle}>{title}</Text>
        <Text style={Type.cardText}>{subtitle}</Text>
      </View>
      {completed ? (
        <View style={styles.checkDone}>
          <FigmaIcon name="iconCheck" />
        </View>
      ) : (
        <View style={styles.checkEmpty} />
      )}
    </>
  );
  const rowStyle = [
    styles.mission,
    highlighted && { backgroundColor: Colors.white },
    dimmed && { opacity: 0.4 },
  ];
  if (!onPress) return <View style={rowStyle}>{content}</View>;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={completed}
      activeOpacity={0.8}
      accessibilityRole="checkbox"
      aria-checked={completed}
      aria-label={`${title}, ${subtitle}`}
      style={rowStyle}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.blue,
    borderRadius: 284,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 16,
    lineHeight: 16,
    color: Colors.white,
  },
  disabled: {
    opacity: 0.4,
  },
  pill: {
    borderRadius: 284,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pillSelected: {
    backgroundColor: Colors.blue,
  },
  pillIdle: {
    backgroundColor: Colors.white,
  },
  pillText: {
    fontFamily: Fonts.interRegular,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.black,
  },
  pillTextSelected: {
    color: Colors.white,
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    borderRadius: 50,
    paddingHorizontal: 8,
  },
  starCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
  },
  starIconBox: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCard: {
    backgroundColor: Colors.glass,
    borderRadius: 24,
    padding: 12,
    overflow: 'hidden',
    ...Shadows.card,
  },
  level: {
    gap: 10,
  },
  levelCentered: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  levelLeft: {
    alignItems: 'flex-start',
    flex: 1,
  },
  dayPill: {
    backgroundColor: Colors.dayPill,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 6,
  },
  dayText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    color: Colors.blue,
  },
  track: {
    alignSelf: 'stretch',
    height: 8,
    borderRadius: 9999,
    backgroundColor: Colors.progressTrack,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 9999,
  },
  levelCaption: {
    alignSelf: 'stretch',
    fontFamily: Fonts.interMedium,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.blue,
    marginTop: -2,
  },
  mission: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    minHeight: 88,
    padding: 20,
    borderRadius: 48,
    backgroundColor: Colors.glass,
  },
  missionIcon: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: Colors.iconBubble,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionText: {
    flex: 1,
  },
  checkEmpty: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  checkDone: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: Colors.blue,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
