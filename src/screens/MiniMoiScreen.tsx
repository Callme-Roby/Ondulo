import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import BillyBlob from '../components/BillyBlob';
import FigmaIcon from '../components/FigmaIcon';
import { GlassCard, LevelProgress, MissionRow, StarCount } from '../components/ui';
import { useAppState } from '../state/AppState';
import { useSettings } from '../hooks/useSettings';
import { Colors, Fonts, Type } from '../constants/theme';

function Slot({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <GlassCard style={styles.slot}>
      <View style={styles.slotInner} aria-label={label}>
        {children}
      </View>
    </GlassCard>
  );
}

export default function MiniMoiScreen() {
  const { day, xp, nextEvolution, stars, history, inventory } = useAppState();
  const openSettings = useSettings();

  return (
    <Screen header={<AppHeader variant="home" onSettings={openSettings} />}>
      <View style={styles.main}>
        <View style={styles.top}>
          <View style={styles.mascot}>
            <View style={styles.ring} />
            <BillyBlob asset="blobMinimoi" period={3.6} />
          </View>
          <LevelProgress day={day} xp={xp} next={nextEvolution} align="left" />
        </View>

        <View style={styles.slots}>
          <Slot label={`${inventory.length} accessoire${inventory.length > 1 ? 's' : ''}`}>
            <FigmaIcon name="iconCloth" />
          </Slot>
          <Slot label={`${stars} étoiles`}>
            <StarCount value={stars} style={styles.starCount} />
          </Slot>
          <Slot label="Statistiques">
            <FigmaIcon name="iconGraph" />
          </Slot>
        </View>

        <View style={styles.history}>
          <Text style={Type.title} accessibilityRole="header">
            Historique des missions
          </Text>
          {history.length === 0 ? (
            <Text style={styles.empty}>Tes missions terminées apparaîtront ici.</Text>
          ) : (
            history.map((mission) => (
              <MissionRow
                key={mission.key}
                title={mission.title}
                subtitle={mission.subtitle}
                icon={mission.icon}
                completed
                dimmed
              />
            ))
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  main: {
    gap: 56,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 56,
  },
  mascot: {
    width: 117,
    height: 117,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.sky,
    opacity: 0.2,
  },
  slots: {
    flexDirection: 'row',
    gap: 12,
  },
  slot: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotInner: {
    alignSelf: 'stretch',
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightWhite,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  starCount: {
    paddingHorizontal: 0,
    gap: 8,
  },
  history: {
    gap: 16,
  },
  empty: {
    fontFamily: Fonts.interRegular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.inkMuted,
  },
});
