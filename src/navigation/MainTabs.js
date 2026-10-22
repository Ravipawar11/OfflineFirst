import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TodayStack } from './TodayStack';
import { HabitsStack } from './HabitsStack';
import { StatsScreen } from '../screens/main/StatsScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { colors, fonts, sizes } from '../theme';
import { useSyncStatus } from '../context/SyncContext';
import { CustomTabBar } from './CustomTabBar';

const Tab = createBottomTabNavigator();

const SyncBadge = () => {
  const { isOnline, isSyncing, pendingCount, runSync } = useSyncStatus();

  let label = 'Synced';
  let dotColor = '#2ECC71';

  if (!isOnline) {
    label = 'Offline';
    dotColor = '#E67E22';
  } else if (isSyncing) {
    label = 'Syncing…';
    dotColor = '#3498DB';
  } else if (pendingCount > 0) {
    label = `${pendingCount} pending`;
    dotColor = '#E67E22';
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Sync status: ${label}`}
      disabled={!isOnline || isSyncing}
      onPress={runSync}
      style={styles.syncBadge}
    >
      <View style={[styles.syncDot, { backgroundColor: dotColor }]} />
      <Text style={styles.syncText}>{label}</Text>
    </Pressable>
  );
};

export const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: fonts.family.semibold,
          fontSize: sizes.md || 18,
        },
        headerRight: () => <SyncBadge />,
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  syncText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: fonts.family.medium,
  },
});
