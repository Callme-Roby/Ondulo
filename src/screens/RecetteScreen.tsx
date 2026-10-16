import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import BillyBlob from '../components/BillyBlob';
import FigmaIcon from '../components/FigmaIcon';
import { InfoTag, Pill, PrimaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import { useSettings } from '../hooks/useSettings';
import { RECIPE } from '../constants/challenges';
import { Colors, Fonts, Type } from '../constants/theme';

type Tab = 'ingredients' | 'steps';

function StepHint({ text }: { text: string }) {
  return (
    <View style={styles.stepHint}>
      <Text style={styles.stepHintText}>{text}</Text>
    </View>
  );
}

export default function RecetteScreen() {
  const navigation = useNavigation();
  const { completeRecipe } = useAppState();
  const openSettings = useSettings();
  const [tab, setTab] = useState<Tab>('ingredients');
  const [step, setStep] = useState(0);

  const isLastStep = step === RECIPE.steps.length - 1;

  const onCta = () => {
    if (tab === 'ingredients') {
      setTab('steps');
    } else if (!isLastStep) {
      setStep(step + 1);
    } else {
      completeRecipe(RECIPE.id);
      navigation.goBack();
    }
  };

  let ctaLabel = 'J’ai tout ce qu’il faut !';
  if (tab === 'steps') ctaLabel = isLastStep ? 'J’ai terminé' : 'Prochaine étape';

  return (
    <Screen
      header={
        <AppHeader
          variant="page"
          title="Recette"
          onBack={() => navigation.goBack()}
          onSettings={openSettings}
        />
      }
      footer={<PrimaryButton label={ctaLabel} onPress={onCta} />}
    >
      <View style={styles.main}>
        <Text style={Type.title} accessibilityRole="header">
          {RECIPE.title}
        </Text>

        <View style={styles.tags}>
          <InfoTag icon="iconTime" label={RECIPE.duration} />
          <InfoTag icon="iconToque" label={RECIPE.difficulty} />
          <InfoTag icon="iconCoin" label={`+  ${RECIPE.reward}  XP`} />
        </View>

        <View style={styles.tabs} accessibilityRole="tablist">
          <Pill
            label="Ingrédients"
            selected={tab === 'ingredients'}
            onPress={() => setTab('ingredients')}
          />
          <Pill label="Étapes" selected={tab === 'steps'} onPress={() => setTab('steps')} />
        </View>

        {tab === 'ingredients' ? (
          <View style={styles.ingredients}>
            {RECIPE.ingredients.map((ingredient) => (
              <View key={ingredient.name} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientQty}>{ingredient.quantity}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.steps}>
            {RECIPE.steps.slice(0, step).map((text) => (
              <StepHint key={text} text={text} />
            ))}
            <Animated.View key={step} entering={FadeIn.duration(300)} style={styles.current}>
              <View style={styles.stepMascot}>
                <View style={styles.ring} />
                <BillyBlob asset="blobStep" period={3} />
              </View>
              <View style={styles.currentCard} aria-live="polite">
                <Text style={styles.currentText}>{RECIPE.steps[step]}</Text>
              </View>
            </Animated.View>
            {step < RECIPE.steps.length - 1 && (
              <View style={styles.upcoming}>
                <View style={styles.line} pointerEvents="none">
                  <FigmaIcon name="stepsLine" />
                </View>
                <View style={styles.upcomingList}>
                  {RECIPE.steps.slice(step + 1).map((text) => (
                    <StepHint key={text} text={text} />
                  ))}
                </View>
              </View>
            )}
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
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  ingredients: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientName: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 14,
    lineHeight: 32,
    letterSpacing: -1.2,
    color: Colors.inkMuted,
  },
  ingredientQty: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 14,
    lineHeight: 32,
    letterSpacing: -1.2,
    color: Colors.blue,
  },
  steps: {
    gap: 16,
    alignItems: 'flex-start',
  },
  stepHint: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    opacity: 0.35,
  },
  stepHintText: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -1.2,
    color: Colors.inkMuted,
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    alignSelf: 'stretch',
  },
  stepMascot: {
    width: 72,
    height: 72,
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
  currentCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
  },
  currentText: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -1.2,
    color: Colors.inkMuted,
  },
  upcoming: {
    paddingLeft: 12,
  },
  line: {
    position: 'absolute',
    left: 1,
    top: -71,
    width: 45,
    height: 164,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingList: {
    gap: 16,
    marginLeft: 12,
  },
});
