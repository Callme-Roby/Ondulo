import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SplashScreen from './SplashScreen';
import LaunchScreen from './LaunchScreen';
import ChatScreen from './ChatScreen';
import { useAppState, Profile } from '../../state/AppState';
import { Colors } from '../../constants/theme';

type Phase = 'splash' | 'launch' | 'chat';

/** Billy's gradient, used when he fills the screen before the first day starts. */
export function BillyCurtain() {
  return (
    <LinearGradient
      colors={[Colors.blobPink, Colors.blobCyan, Colors.blobGreen]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
}

export default function OnboardingFlow() {
  const { completeOnboarding } = useAppState();
  const [phase, setPhase] = useState<Phase>('splash');
  const [height, setHeight] = useState(844);
  const fill = useSharedValue(0);

  const toLaunch = useCallback(() => setPhase('launch'), []);
  const toChat = useCallback(() => setPhase('chat'), []);

  // Billy floods the screen, then the first day begins
  const finish = (profile: Profile) => {
    fill.value = withTiming(1, { duration: 900, easing: Easing.in(Easing.cubic) }, (done) => {
      if (done) runOnJS(completeOnboarding)(profile);
    });
  };

  const curtainStyle = useAnimatedStyle(() => ({
    height: 150 + fill.value * (height - 150),
    opacity: fill.value === 0 ? 0 : 1,
  }));

  return (
    <View style={styles.root} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      {phase === 'splash' && <SplashScreen onDone={toLaunch} />}
      {phase === 'launch' && <LaunchScreen onDone={toChat} />}
      {phase === 'chat' && <ChatScreen onFinish={finish} />}
      <Animated.View style={[styles.curtain, curtainStyle]} pointerEvents="none">
        <BillyCurtain />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.lightWhite,
  },
  curtain: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
});
