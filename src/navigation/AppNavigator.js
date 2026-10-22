import React, { useContext, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { LoadingScreen } from '../components/states';
import { SplashScreen } from '../screens/auth/SplashScreen';

export const AppNavigator = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  // 1. Show splash while animation runs OR while auth is still checking
  if (!splashDone || isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // 2. After splash → decide destination based on userToken
  return (
    <NavigationContainer>
      {userToken !== null ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};