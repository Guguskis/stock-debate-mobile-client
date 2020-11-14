import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from "react-native";

import Index from './src/Index';
import properties from './src/properties/properties';

export default function App() {
  return (
    <SafeAreaProvider style={styles.body}>
      <Index />
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: properties.color.background
  }
});