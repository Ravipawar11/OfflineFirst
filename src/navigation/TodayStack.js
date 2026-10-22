import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TodayScreen } from '../screens/main/TodayScreen';
import { HabitDetailsScreen } from '../screens/main/HabitDetailsScreen';
import { colors, fonts, sizes } from '../theme';

const Stack = createNativeStackNavigator();

export const TodayStack = () => (
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
      name="TodayMain"
      component={TodayScreen}
      options={{ title: "Today's Habits" }}
    />
    <Stack.Screen
      name="HabitDetails"
      component={HabitDetailsScreen}
      options={{ title: 'Habit Details' }}
    />
  </Stack.Navigator>
);