import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import FigmaIcon from '../components/FigmaIcon';
import { InfoTag, PrimaryButton } from '../components/ui';
import { formatCooldown } from './DefisScreen';
import { useAppState } from '../state/AppState';
import { useSettings } from '../hooks/useSettings';
import { WALK } from '../constants/challenges';
import { Colors, Fonts, Type } from '../constants/theme';

// Positions from the Figma frame, relative to the route block
const TRACK_TOP = 8;
const TRACK_HEIGHT = 413;
const MAP_TOP = 32;
const MAP_LEFT = 56;

export default function ParcoursScreen() {
  const navigation = useNavigation();
  const { walkCooldown, completeWalk } = useAppState();
  const openSettings = useSettings();
  const available = walkCooldown === 0;

  const onDone = () => {
    completeWalk();
    navigation.goBack();
  };

  return (
    <Screen
      header={
        <AppHeader
          variant="page"
          title="Parcours"
          onBack={() => navigation.goBack()}
          onSettings={openSettings}
        />
      }
      footer={
        <PrimaryButton
          label={available ? 'J’ai terminé' : `Nouveau parcours dans ${formatCooldown(walkCooldown)}`}
          onPress={onDone}
          disabled={!available}
        />
      }
    >
      <View style={styles.main}>
        <Text style={Type.title} accessibilityRole="header">
          {WALK.title}
        </Text>

        <View style={styles.tags}>
          <InfoTag icon="iconTime" label={WALK.duration} />
          <InfoTag icon="iconRunning" label={WALK.distance} />
          <InfoTag icon="iconCoin" label={`+  ${WALK.reward}  XP`} />
        </View>

        <View
          style={styles.route}
          aria-label={`Itinéraire de ${WALK.distance} entre ${WALK.start} et ${WALK.end}`}
        >
          <Text style={[styles.place, { top: 0 }]}>{WALK.end}</Text>
          <FigmaIcon name="mapTrack" style={styles.track} />
          <FigmaIcon name="mapArrow" style={styles.arrow} />
          <Text style={[styles.place, { top: TRACK_TOP + TRACK_HEIGHT - 8 }]}>{WALK.start}</Text>

          <View style={styles.map}>
            <FigmaIcon name="map" style={StyleSheet.absoluteFill} />
            <FigmaIcon name="mapRoute" style={{ position: 'absolute', left: 119, top: 72.5 }} />
            <FigmaIcon name="mapRouteStroke" style={{ position: 'absolute', left: 115.5, top: 70 }} />
            <View style={styles.cursor}>
              <FigmaIcon name="mapCursor" style={{ transform: [{ rotate: '44deg' }] }} />
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  main: {
    gap: 32,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  route: {
    height: TRACK_TOP + TRACK_HEIGHT + 16,
  },
  place: {
    position: 'absolute',
    left: 24,
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: -1.2,
    color: Colors.blue,
  },
  track: {
    position: 'absolute',
    left: 12 - 5.33,
    top: TRACK_TOP - 5.33,
  },
  arrow: {
    position: 'absolute',
    left: -2,
    top: 208 - 2,
  },
  map: {
    position: 'absolute',
    left: MAP_LEFT,
    top: MAP_TOP,
    width: 286,
    height: 365,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(19, 90, 157, 0.25)',
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  cursor: {
    position: 'absolute',
    left: 123,
    top: 162,
    width: 71.6,
    height: 72.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
