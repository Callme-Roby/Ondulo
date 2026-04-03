import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

export default function MiniMoiScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mini Moi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  text: { fontSize: 18, color: Colors.textMedium },
});
