import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthProvider } from './src/context/AuthContext';
import { SyncProvider } from './src/context/SyncContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  const [iconFontsReady, setIconFontsReady] = useState(false);

  useEffect(() => {
    Promise.all([Ionicons.loadFont(), MaterialCommunityIcons.loadFont()])
      .catch(error => console.warn('Unable to load icon fonts:', error))
      .finally(() => setIconFontsReady(true));
  }, []);

  if (!iconFontsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <SyncProvider>
        <AppNavigator />
      </SyncProvider>
    </AuthProvider>
  );
}
