import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import BillyBlob from '../components/BillyBlob';
import { LevelProgress, MissionRow } from '../components/ui';
import { useAppState } from '../state/AppState';
import { useSettings } from '../hooks/useSettings';
import { Colors, Fonts, Shadows, Type } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { day, xp, nextEvolution, missions, petName, completeMission } = useAppState();
  const openSettings = useSettings();

  const done = missions.filter((m) => m.completed).length;
  const ratio = missions.length > 0 ? done / missions.length : 0;
  const nextMission = missions.find((m) => !m.completed);

  // Day 1 follows the Figma "Premier pas" frames: a grey, thirsty Billy, then
  // the colourful "Blob heureux" once he has had his water.
  const firstDay = day <= 1;
  const blob = firstDay ? (done > 0 ? 'blobHydrated' : 'blobThirsty') : 'blobHome';

  let mood: string;
  if (firstDay) mood = done > 0 ? 'est hydraté' : 'a soif';
  else if (ratio >= 0.6) mood = 'se sent frais';
  else if (ratio >= 0.3) mood = 'se réveille';
  else mood = 'a besoin de toi';

  const onMission = (id: string, photo?: boolean) => {
    if (photo) navigation.navigate('Photo', { missionId: id });
    else completeMission(id);
  };

  return (
    <Screen header={<AppHeader variant="home" onSettings={openSettings} />}>
      <View style={styles.main}>
        <LevelProgress day={day} xp={xp} next={nextEvolution} />

        <View style={styles.hero}>
          <View style={styles.ring} />
          <BillyBlob
            asset={blob}
            energy={firstDay ? 1 : ratio}
            period={firstDay ? (done > 0 ? 3.2 : 4.4) : ratio > 0.5 ? 3.2 : 4.4}
          />
          <View style={styles.status}>
            <Text style={styles.statusText}>
              {petName} {mood}
            </Text>
          </View>
        </View>

        <View style={styles.missions}>
          <View style={styles.missionsHeader}>
            <Text style={Type.title} accessibilityRole="header">
              Missions{'\n'}Quotidiennes
            </Text>
            <Text style={styles.counter}>
              {done} sur {missions.length}
              {'\n'}terminées
            </Text>
          </View>
          {missions.map((mission) => (
            <MissionRow
              key={mission.id}
              title={mission.title}
              subtitle={mission.subtitle}
              icon={mission.icon}
              completed={mission.completed}
              highlighted={mission.id === nextMission?.id}
              onPress={() => onMission(mission.id, mission.photo)}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  main: {
    gap: 56,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    width: '100%',
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.sky,
    opacity: 0.2,
  },
  status: {
    position: 'absolute',
    bottom: -16,
    backgroundColor: Colors.glass,
    borderRadius: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
    ...Shadows.badge,
  },
  statusText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.blue,
  },
  missions: {
    gap: 16,
  },
  missionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  counter: {
    fontFamily: Fonts.interMedium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.blue,
    textAlign: 'right',
  },
});
