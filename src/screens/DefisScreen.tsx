import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import FigmaIcon from '../components/FigmaIcon';
import { GlassCard, InfoTag } from '../components/ui';
import { FigmaAssetName } from '../assets/figma';
import { useAppState } from '../state/AppState';
import { useSettings } from '../hooks/useSettings';
import { RECIPE, WALK } from '../constants/challenges';
import { Colors, Fonts, Type } from '../constants/theme';
import type { DefisStackParamList } from '../navigation/types';

export function formatCooldown(ms: number): string {
  const minutes = Math.ceil(ms / 60_000);
  return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`;
}

function ChallengeCard({
  icon,
  title,
  reward,
  difficulty,
  done,
  disabled = false,
  onPress,
}: {
  icon: FigmaAssetName;
  title: string;
  reward: number;
  difficulty: string;
  done: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      aria-label={`${title}, ${difficulty}, ${done ? 'déjà réalisé' : `${reward} XP`}`}
    >
      <GlassCard style={[styles.card, disabled && { opacity: 0.4 }]}>
        <View style={styles.thumb}>
          <FigmaIcon name={icon} />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.tags}>
            <InfoTag icon="iconToque" label={difficulty} />
            <InfoTag icon="iconCoin" label={done ? 'Réalisé' : `+  ${reward}  XP`} />
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

export default function DefisScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DefisStackParamList>>();
  const { petName, recipesDone, walkCooldown } = useAppState();
  const openSettings = useSettings();

  return (
    <Screen
      header={
        <AppHeader
          variant="page"
          title="défis"
          onBack={() => navigation.getParent()?.navigate('Accueil')}
          onSettings={openSettings}
        />
      }
    >
      <View style={styles.main}>
        <View style={styles.heading}>
          <Text style={Type.title} accessibilityRole="header">
            Les défis de {petName}
          </Text>
          <Text style={Type.subtitle}>
            Relève des défis pour gagner des points et faire grandir {petName}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={Type.sectionLabel}>Recettes</Text>
          <ChallengeCard
            icon="iconCloth"
            title={RECIPE.title}
            difficulty={RECIPE.difficulty}
            reward={RECIPE.reward}
            done={recipesDone.includes(RECIPE.id)}
            onPress={() => navigation.navigate('Recette', { recipeId: RECIPE.id })}
          />
          <GlassCard style={styles.locked}>
            <View style={styles.lockedInner} aria-label="Prochaine recette verrouillée">
              <FigmaIcon name="iconLock" />
            </View>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <Text style={Type.sectionLabel}>Parcours</Text>
          <ChallengeCard
            icon="iconMuscle"
            title={WALK.title}
            difficulty="Facile"
            reward={WALK.reward}
            done={walkCooldown > 0}
            disabled={walkCooldown > 0}
            onPress={() => navigation.navigate('Parcours')}
          />
          {walkCooldown > 0 && (
            <GlassCard style={styles.locked}>
              <View style={styles.delay}>
                <FigmaIcon name="iconTime" />
                <Text style={styles.delayText}>
                  Nouveau parcours dans {formatCooldown(walkCooldown)}
                </Text>
              </View>
            </GlassCard>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  main: {
    gap: 32,
  },
  heading: {
    gap: 8,
  },
  section: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
  },
  thumb: {
    width: 75,
    height: 75,
    borderRadius: 12,
    backgroundColor: Colors.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.black,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
  },
  locked: {
    height: 99,
  },
  lockedInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  delayText: {
    fontFamily: Fonts.interMedium,
    fontSize: 12,
    lineHeight: 20,
    color: Colors.blue,
  },
});
