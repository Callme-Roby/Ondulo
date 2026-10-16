import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import MiniMoiScreen from './src/screens/MiniMoiScreen';
import BoutiqueScreen from './src/screens/BoutiqueScreen';
import AmisScreen from './src/screens/AmisScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import TabBar from './src/components/TabBar';
import WebFrame from './src/components/WebFrame';
import { ProfileContext } from './src/context/ProfileContext';
import { Profile, clearProfile, loadProfile } from './src/storage/profileStore';
import { Colors } from './src/constants/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  // undefined while reading storage, null when onboarding is needed
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    loadProfile().then(setProfile);
  }, []);

  const restartOnboarding = useCallback(() => {
    clearProfile();
    setProfile(null);
  }, []);

  const profileContext = useMemo(
    () => (profile ? { profile, restartOnboarding } : null),
    [profile, restartOnboarding]
  );

  return (
    <SafeAreaProvider>
      <WebFrame>
        <StatusBar style="dark" />
        {profile === undefined && <View style={{ flex: 1, backgroundColor: Colors.background }} />}
        {profile === null && <OnboardingScreen onComplete={setProfile} />}
        {profileContext && (
          <ProfileContext.Provider value={profileContext}>
            <NavigationContainer
              documentTitle={{ formatter: (_options, route) => `${route?.name ?? 'Accueil'} · Ondulo` }}
            >
              <Tab.Navigator
                tabBar={(props) => <TabBar {...props} />}
                screenOptions={{ headerShown: false }}
              >
                <Tab.Screen name="Accueil" component={HomeScreen} />
                <Tab.Screen name="Mini Moi" component={MiniMoiScreen} />
                <Tab.Screen name="Boutique" component={BoutiqueScreen} />
                <Tab.Screen name="Amis" component={AmisScreen} />
              </Tab.Navigator>
            </NavigationContainer>
          </ProfileContext.Provider>
        )}
      </WebFrame>
    </SafeAreaProvider>
  );
}
