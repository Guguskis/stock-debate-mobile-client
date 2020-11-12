import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import Index from './src/Index';
import MainScreen from './src/screen/MainScreen';

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <Index />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  }
});
