import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HabitsScreen } from '../screens/main/HabitsScreen';
import { HabitFormScreen } from '../screens/main/HabitFormScreen';
import { HabitDetailsScreen } from '../screens/main/HabitDetailsScreen';
import { colors, fonts, sizes } from '../theme';

const Stack = createNativeStackNavigator();

export const HabitsStack = () => (
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
      name="HabitsList"
      component={HabitsScreen}
      options={{ title: 'My Habits' }}
    />
    <Stack.Screen
      name="HabitForm"
      component={HabitFormScreen}
      options={({ route }) => ({
        title: route.params?.habitId ? 'Edit Habit' : 'New Habit',
      })}
    />
    <Stack.Screen
      name="HabitDetails"
      component={HabitDetailsScreen}
      options={{ title: 'Habit Details' }}
    />
  </Stack.Navigator>
);