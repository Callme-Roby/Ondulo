import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FigmaIcon from './FigmaIcon';
import { StarCount } from './ui';
import { FigmaAssetName } from '../assets/figma';
import { Colors, Fonts } from '../constants/theme';

type HeaderProps =
  | { variant: 'home'; onSettings: () => void }
  | { variant: 'page'; title: string; onBack: () => void; onSettings: () => void }
  | { variant: 'shop'; title: string; onBack: () => void; stars: number }
  | { variant: 'photo'; title: string; onBack: () => void };

/** Round 40px button of the page headers (white with the brand radial tint). */
function RoundButton({
  icon,
  label,
  onPress,
}: {
  icon: FigmaAssetName;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      aria-label={label}
      style={styles.roundButton}
    >
      <LinearGradient
        colors={['rgba(167,243,236,0.5)', 'rgba(221,200,255,0.5)', 'rgba(221,234,250,0.5)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
      />
      <FigmaIcon name={icon} />
    </TouchableOpacity>
  );
}

/** Top bar of every screen ("header" component, situations home / page / boutique). */
export default function AppHeader(props: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: 24 + insets.top }]} pointerEvents="box-none">
      <LinearGradient
        colors={[Colors.middleWhite, 'rgba(228,234,239,0)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {props.variant === 'home' ? (
        <View style={[styles.row, { alignItems: 'flex-end' }]}>
          <View style={styles.profile} aria-label="Profil">
            <FigmaIcon name="headerProfile" />
          </View>
          <Text style={styles.brand} accessibilityRole="header">
            Ondulo
          </Text>
          <TouchableOpacity
            onPress={props.onSettings}
            activeOpacity={0.8}
            accessibilityRole="button"
            aria-label="Réglages"
            style={styles.settings}
          >
            <FigmaIcon name="headerSettings" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.row}>
          <RoundButton icon="headerBack" label="Retour" onPress={props.onBack} />
          <Text style={styles.title} accessibilityRole="header">
            {props.title}
          </Text>
          {props.variant === 'page' && (
            <RoundButton icon="headerSettingsPage" label="Réglages" onPress={props.onSettings} />
          )}
          {props.variant === 'shop' && <StarCount value={props.stars} style={styles.balance} />}
          {props.variant === 'photo' && <View style={styles.spacer} />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  row: {
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: Colors.lightWhite,
    backgroundColor: Colors.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  brand: {
    fontFamily: Fonts.jakartaExtraBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -1.2,
    color: Colors.blue,
  },
  settings: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.lightWhite,
    backgroundColor: Colors.lightWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 16,
    lineHeight: 32,
    letterSpacing: -1.2,
    color: Colors.blueText,
  },
  balance: {
    backgroundColor: Colors.white,
  },
  spacer: {
    width: 40,
  },
});
