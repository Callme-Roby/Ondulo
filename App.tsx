import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import MiniMoiScreen from './src/screens/MiniMoiScreen';
import BoutiqueScreen from './src/screens/BoutiqueScreen';
import AmisScreen from './src/screens/AmisScreen';
import TabBar from './src/components/TabBar';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
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
    </SafeAreaProvider>
  );
}
