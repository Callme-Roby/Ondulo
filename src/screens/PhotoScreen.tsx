import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import FigmaIcon from '../components/FigmaIcon';
import MissionCamera, { MissionCameraHandle } from '../components/MissionCamera';
import { PrimaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import { findMission } from '../constants/missions';
import { Colors, Fonts, Type } from '../constants/theme';
import type { RootStackParamList } from '../navigation/types';

const MISSION_ICONS = {
  mobility: 'missionMobility',
  hygiene: 'missionHygiene',
  meal: 'missionMeal',
} as const;

type CameraStatus = 'starting' | 'ready' | 'unavailable';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.center}>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

/** Proof of a mission with a selfie. The photo is only kept in memory, never saved. */
export default function PhotoScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'Photo'>>();
  const { cguAccepted, acceptCgu, completeMission } = useAppState();
  const [status, setStatus] = useState<CameraStatus>('starting');
  const [shot, setShot] = useState<string | null>(null);
  const camera = useRef<MissionCameraHandle>(null);
  const mission = findMission(params.missionId);

  const finish = () => {
    completeMission(params.missionId);
    navigation.goBack();
  };

  const takePhoto = async () => {
    const uri = await camera.current?.takePicture();
    if (!uri) {
      setStatus('unavailable');
      return;
    }
    setShot(uri);
    setTimeout(finish, 900);
  };

  return (
    <Screen
      withTabBar={false}
      header={<AppHeader variant="photo" title="Ondulo photo" onBack={() => navigation.goBack()} />}
    >
      <View style={styles.main}>
        <View style={styles.frame}>
          {cguAccepted && status !== 'unavailable' && !shot && (
            <MissionCamera
              ref={camera}
              onReady={() => setStatus('ready')}
              onUnavailable={() => setStatus('unavailable')}
            />
          )}
          {shot && <Image source={{ uri: shot }} style={StyleSheet.absoluteFill} contentFit="cover" />}
          <View style={styles.dim} pointerEvents="none" />

          {!cguAccepted && (
            <Card>
              <Text style={styles.title}>Conditions d'utilisation et collecte de données</Text>
              <View style={styles.body}>
                <Text style={styles.text}>
                  Toutes les données collectées sont utilisées dans le seul but d'assurer le bon
                  fonctionnement du service et ne sont jamais stockées de manière prolongée.
                </Text>
                <Text style={styles.text}>
                  Les seules informations conservées à long terme sont liées à votre progression,
                  votre inventaire et vos réussites.
                </Text>
              </View>
              <PrimaryButton label="J’accepte les conditions" onPress={acceptCgu} />
            </Card>
          )}

          {cguAccepted && status === 'unavailable' && (
            <Card>
              <Text style={styles.text}>
                La caméra n’est pas disponible ici. Tu peux quand même valider ta mission.
              </Text>
              <PrimaryButton label="Valider sans photo" onPress={finish} />
            </Card>
          )}

          {cguAccepted && status === 'starting' && (
            <View style={styles.center} pointerEvents="none">
              <ActivityIndicator color={Colors.white} />
            </View>
          )}

          {cguAccepted && status === 'ready' && !shot && (
            <TouchableOpacity
              onPress={takePhoto}
              activeOpacity={0.8}
              accessibilityRole="button"
              aria-label="Prendre la photo"
              style={styles.shutter}
            >
              <FigmaIcon name="cameraShutter" />
            </TouchableOpacity>
          )}
        </View>

        {mission && (
          <View style={styles.mission}>
            <View style={styles.missionIcon}>
              <FigmaIcon name={MISSION_ICONS[mission.icon]} />
            </View>
            <View style={styles.missionText}>
              <Text style={Type.cardTitle}>{mission.title}</Text>
              <Text style={Type.cardText}>{mission.subtitle}</Text>
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  main: {
    gap: 32,
  },
  frame: {
    height: 644,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(19, 90, 157, 0.25)',
    backgroundColor: Colors.black,
    overflow: 'hidden',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: Colors.cguCard,
    borderRadius: 12,
    padding: 16,
    gap: 24,
  },
  title: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 24,
    lineHeight: 26.4,
    letterSpacing: -0.6,
    color: Colors.black,
  },
  body: {
    gap: 12,
  },
  text: {
    fontFamily: Fonts.interRegular,
    fontSize: 16,
    lineHeight: 19.2,
    letterSpacing: -0.6,
    color: Colors.black,
  },
  shutter: {
    position: 'absolute',
    bottom: 27,
    alignSelf: 'center',
  },
  mission: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
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
});
