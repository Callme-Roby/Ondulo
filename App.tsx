import React, { useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { FadeOut } from 'react-native-reanimated';
import { useFonts } from 'expo-font';
// Weight-specific imports keep the other font files out of the bundle
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_400Regular_Italic } from '@expo-google-fonts/inter/400Regular_Italic';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';

import HomeScreen from './src/screens/HomeScreen';
import MiniMoiScreen from './src/screens/MiniMoiScreen';
import BoutiqueScreen from './src/screens/BoutiqueScreen';
import DefisScreen from './src/screens/DefisScreen';
import RecetteScreen from './src/screens/RecetteScreen';
import ParcoursScreen from './src/screens/ParcoursScreen';
import PhotoScreen from './src/screens/PhotoScreen';
import OnboardingFlow, { BillyCurtain } from './src/screens/onboarding/OnboardingFlow';
import TabBar from './src/components/TabBar';
import WebFrame from './src/components/WebFrame';
import { AppStateProvider, useAppState } from './src/state/AppState';
import { Colors } from './src/constants/theme';
import type {
  DefisStackParamList,
  RootStackParamList,
  TabParamList,
} from './src/navigation/types';

const Root = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Defis = createNativeStackNavigator<DefisStackParamList>();

function DefisStack() {
  return (
    <Defis.Navigator screenOptions={{ headerShown: false }}>
      <Defis.Screen name="DefisList" component={DefisScreen} options={{ title: 'Défis' }} />
      <Defis.Screen name="Recette" component={RecetteScreen} />
      <Defis.Screen name="Parcours" component={ParcoursScreen} />
    </Defis.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Mini Moi" component={MiniMoiScreen} />
      <Tab.Screen name="Boutique" component={BoutiqueScreen} />
      <Tab.Screen name="Défis" component={DefisStack} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { hydrated, profile } = useAppState();
  const wasOnboarding = useRef(false);
  const [curtain, setCurtain] = useState(false);

  // Right after the onboarding, Billy's gradient fades away to reveal day 1
  // (layout effect: the curtain is up before the first frame of the home screen)
  useLayoutEffect(() => {
    if (!hydrated) return;
    if (!profile) {
      wasOnboarding.current = true;
    } else if (wasOnboarding.current) {
      wasOnboarding.current = false;
      setCurtain(true);
      const timer = setTimeout(() => setCurtain(false), 60);
      return () => clearTimeout(timer);
    }
  }, [hydrated, profile]);

  if (!hydrated) return <View style={styles.blank} />;
  if (!profile) return <OnboardingFlow />;

  return (
    <View style={styles.flex}>
      <NavigationContainer
        documentTitle={{ formatter: (_options, route) => `${route?.name ?? 'Accueil'} · Ondulo` }}
      >
        <Root.Navigator screenOptions={{ headerShown: false }}>
          <Root.Screen name="Tabs" component={Tabs} />
          <Root.Screen
            name="Photo"
            component={PhotoScreen}
            options={{ presentation: 'fullScreenModal', title: 'Ondulo photo' }}
          />
        </Root.Navigator>
      </NavigationContainer>
      {curtain && (
        <Animated.View
          style={StyleSheet.absoluteFill}
          exiting={FadeOut.duration(800)}
          pointerEvents="none"
        >
          <BillyCurtain />
        </Animated.View>
      )}
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Inter_400Regular,
    Inter_400Regular_Italic,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  return (
    <SafeAreaProvider>
      <WebFrame>
        <StatusBar style="dark" />
        {/* Fonts are bundled; if one fails to load, fall back to the system font */}
        {fontsLoaded || fontError ? (
          <AppStateProvider>
            <AppContent />
          </AppStateProvider>
        ) : (
          <View style={styles.blank} />
        )}
      </WebFrame>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  blank: {
    flex: 1,
    backgroundColor: Colors.lightWhite,
  },
});
