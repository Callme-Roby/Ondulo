import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import ScreenBackground from '../../components/ScreenBackground';
import BillyBlob from '../../components/BillyBlob';
import { Colors, Fonts } from '../../constants/theme';

const SPLASH_DURATION = 2400;

/** First screen: Billy's outline and the app's promise. */
export default function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <Animated.View style={styles.root} exiting={FadeOut.duration(300)}>
      <ScreenBackground flat />
      <Pressable style={styles.center} onPress={onDone} aria-label="Ondulo">
        <BillyBlob asset="blobSplash" period={2.4} />
      </Pressable>
      <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.taglineBox}>
        <Text style={styles.tagline}>
          Maintenir des objectifs journaliers{'\n'}aide à renforcer l’épanouissement
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

export const launchTextStyle = {
  fontFamily: Fonts.interItalic,
  fontSize: 18,
  lineHeight: 29.25,
  color: Colors.blue,
  textAlign: 'center' as const,
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineBox: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 54,
  },
  tagline: { ...launchTextStyle, opacity: 0.6 },
});

