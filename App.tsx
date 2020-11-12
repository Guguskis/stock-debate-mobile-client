import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Index from './src/Index';

export default function App() {
  return (
    <SafeAreaProvider>
      <Index />
    </SafeAreaProvider>
  );
}

