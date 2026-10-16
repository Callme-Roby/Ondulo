import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { Colors, Fonts } from '../constants/theme';
import { DAILY_MISSIONS, Mission } from '../constants/missions';
import Blob from '../components/Blob';
import MissionCard from '../components/MissionCard';
import { loadCompletion, saveCompletion } from '../storage/missionStore';

function SettingsIcon() {
  return (
    <View style={styles.settingsBtn}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="3" stroke={Colors.textMedium} strokeWidth="1.8" />
        <Path
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
          stroke={Colors.textMedium}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function ProfileAvatar() {
  return (
    <View style={styles.avatar}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" fill={Colors.textLight} />
        <Path
          d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6"
          stroke={Colors.textLight}
          strokeWidth="1.5"
          fill="none"
        />
      </Svg>
    </View>
  );
}

export default function HomeScreen() {
  const [missions, setMissions] = useState<Mission[]>(DAILY_MISSIONS);

  // Restore mission progress saved on this device
  useEffect(() => {
    loadCompletion().then((saved) => {
      if (!saved) return;
      setMissions((prev) =>
        prev.map((m) => (m.id in saved ? { ...m, completed: saved[m.id] } : m))
      );
    });
  }, []);

  const completedCount = useMemo(
    () => missions.filter((m) => m.completed).length,
    [missions]
  );
  const completionRatio = missions.length > 0 ? completedCount / missions.length : 0;

  // XP based on completed missions (for demo)
  const xpPerMission = 160;
  const currentXP = completedCount * xpPerMission;
  const targetXP = 500;
  const xpProgress = Math.min(currentXP / targetXP, 1);

  const day = 5;

  const toggleMission = (id: string) => {
    const next = missions.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m));
    setMissions(next);
    saveCompletion(Object.fromEntries(next.map((m) => [m.id, m.completed])));
  };

  const blobMood = completionRatio >= 0.6
    ? 'se sent frais'
    : completionRatio >= 0.3
    ? 'se réveille'
    : 'a besoin de toi';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ProfileAvatar />
          <Text style={styles.appTitle}>Ondulo</Text>
          <SettingsIcon />
        </View>

        {/* Day badge */}
        <View style={styles.dayBadge}>
          <Text style={styles.dayText}>JOUR {day}</Text>
        </View>

        {/* XP Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${xpProgress * 100}%` }]} />
          </View>
        </View>
        <Text style={styles.xpText}>
          {currentXP} / {targetXP} XP AVANT LA PROCHAINE ÉVOLUTION
        </Text>

        {/* Blob */}
        <Blob completionRatio={completionRatio} />

        {/* Blob status */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Billy {blobMood}</Text>
        </View>

        {/* Missions section */}
        <View style={styles.missionsHeader}>
          <Text style={styles.missionsTitle}>
            Missions{'\n'}Quotidiennes
          </Text>
          <Text style={styles.missionsCount}>
            {completedCount} sur {missions.length}{'\n'}terminées
          </Text>
        </View>

        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onToggle={toggleMission}
          />
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: Fonts.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dayBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dayText: {
    fontSize: 13,
    fontWeight: Fonts.bold,
    color: Colors.textMedium,
    letterSpacing: 1,
  },
  progressContainer: {
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.progressBg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.progressFill,
    borderRadius: 3,
  },
  xpText: {
    fontSize: 11,
    fontWeight: Fonts.semiBold,
    color: Colors.primaryLight,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statusText: {
    fontSize: 15,
    fontWeight: Fonts.semiBold,
    color: Colors.primary,
  },
  missionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  missionsTitle: {
    fontSize: 22,
    fontWeight: Fonts.bold,
    color: Colors.textDark,
    lineHeight: 28,
  },
  missionsCount: {
    fontSize: 14,
    fontWeight: Fonts.semiBold,
    color: Colors.primaryLight,
    textAlign: 'right',
    lineHeight: 20,
  },
});
