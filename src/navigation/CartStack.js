import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartScreen } from '../screens/main/CartScreen';
import { CheckoutScreen } from '../screens/main/CheckoutScreen';
import { colors, fonts, sizes } from '../theme';

const Stack = createNativeStackNavigator();

export const CartStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontFamily: fonts.family.semibold,
        fontSize: sizes.md || 18,
      },
    }}
  >
    <Stack.Screen
      name="CartHome"
      component={CartScreen}
      options={{ title: 'My Cart' }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{ title: 'Checkout' }}  
    />
  </Stack.Navigator>
);