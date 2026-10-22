import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/main/HomeScreen';
import { ProductsScreen } from '../screens/main/ProductsScreen';
import { ProductDetailsScreen } from '../screens/main/ProductDetailsScreen';
import { colors, fonts, sizes } from '../theme';

const Stack = createNativeStackNavigator();

export const HomeStack = () => (
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
      name="HomeMain"
      component={HomeScreen}
      options={{ title: 'Home' }}
    />
    <Stack.Screen
      name="Products"
      component={ProductsScreen}
      options={{ title: 'All Products' }}
    />
    <Stack.Screen
      name="ProductDetails"
      component={ProductDetailsScreen}
      options={{ title: 'Product Details' }}
    />
  </Stack.Navigator>
);