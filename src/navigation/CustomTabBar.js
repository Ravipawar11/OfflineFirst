import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useSyncStatus } from '../context/SyncContext';
import { colors, fonts, sizes } from '../theme';

const icons = {
  Today: ['today-outline', 'today'],
  Habits: ['list-outline', 'list'],
  Stats: ['stats-chart-outline', 'stats-chart'],
  Settings: ['settings-outline', 'settings'],
};

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { isOnline, isSyncing, pendingCount, runSync } = useSyncStatus();
  const haptic = (type = 'impactLight') => ReactNativeHapticFeedback.trigger(type, {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  });
  const statusLabel = !isOnline ? 'Offline' : isSyncing ? 'Syncing' : pendingCount ? `${pendingCount} to sync` : 'Up to date';

  const retrySync = () => {
    if (!isOnline || isSyncing) return;
    haptic();
    runSync();
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a habit"
        onPress={() => {
          haptic('impactMedium');
          navigation.navigate('Habits', { screen: 'HabitForm' });
        }}
        style={styles.addButton}
      >
        <Icon name="add" size={28} color={colors.white} />
      </Pressable>

      <View style={styles.statusRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Sync status: ${statusLabel}`}
          disabled={!isOnline || isSyncing}
          onPress={retrySync}
          style={({ pressed }) => [styles.statusPill, pressed && styles.statusPillPressed]}
        >
          <Icon name={!isOnline ? 'cloud-offline-outline' : isSyncing ? 'sync' : 'cloud-done-outline'} size={15} color={!isOnline ? colors.warning : colors.success} />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </Pressable>
        <Text style={styles.hint}>Tap + to add a habit</Text>
      </View>

      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const focused = state.index === index;
          const iconNames = icons[route.name] ?? ['ellipse-outline', 'ellipse'];
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              haptic();
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={`${label} tab`}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              onPress={onPress}
              style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
            >
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Icon name={focused ? iconNames[1] : iconNames[0]} size={22} color={focused ? colors.primary : colors.textMuted} />
              </View>
              <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { backgroundColor: colors.white, borderTopColor: colors.borderLight, borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingTop: 8, shadowColor: '#172B4D', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 14 },
  statusRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, paddingRight: 54 },
  statusPill: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 999, flexDirection: 'row', gap: 5, paddingHorizontal: 9, paddingVertical: 5 },
  statusPillPressed: { opacity: 0.7 },
  statusText: { color: colors.textSecondary, fontFamily: fonts.family.medium, fontSize: 11 },
  hint: { color: colors.textMuted, fontFamily: fonts.family.regular, fontSize: 10 },
  addButton: { alignItems: 'center', backgroundColor: colors.primary, borderColor: colors.white, borderRadius: 25, borderWidth: 4, elevation: 8, height: 50, justifyContent: 'center', position: 'absolute', right: 18, shadowColor: colors.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 8, top: -18, width: 50, zIndex: 2 },
  bar: { flexDirection: 'row', justifyContent: 'space-around' },
  tab: { alignItems: 'center', flex: 1, gap: 2, minHeight: 43, justifyContent: 'center' },
  tabPressed: { opacity: 0.65 },
  iconWrap: { alignItems: 'center', borderRadius: 12, height: 27, justifyContent: 'center', width: 42 },
  iconWrapActive: { backgroundColor: colors.primarySoft },
  label: { color: colors.textMuted, fontFamily: fonts.family.medium, fontSize: sizes.xs - 1 },
  labelActive: { color: colors.primary, fontFamily: fonts.family.semibold },
});
