import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useSyncStatus } from '../../context/SyncContext';
import { getTodayHabits, toggleHabitLog } from '../../services/habitRepository';
import { todayStr } from '../../utils/date';
import { colors, fonts, sizes } from '../../theme';

export const TodayScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { isOnline, refreshPendingCount, runSync } = useSyncStatus();
  const [habits, setHabits] = useState([]);

  const load = useCallback(async () => {
    if (user) setHabits(await getTodayHabits(user.uid, todayStr()));
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggle = async (habit) => {
    await toggleHabitLog(user.uid, habit.id, todayStr());
    await load();
    await refreshPendingCount();
    if (isOnline) runSync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today</Text>
      <Text style={styles.subheading}>Small actions, every day.</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={habits.length ? styles.list : styles.emptyList}
        ListEmptyComponent={<Text style={styles.empty}>No habits yet. Add one from the Habits tab.</Text>}
        renderItem={({ item }) => {
          const done = item.today_completed === 1;
          return (
            <Pressable style={styles.card} onPress={() => navigation.navigate('HabitDetails', { habitId: item.id })}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: done }}
                style={[styles.check, done && styles.checkDone]}
                onPress={(event) => { event.stopPropagation(); toggle(item); }}
              >
                <Text style={styles.checkText}>{done ? '✓' : ''}</Text>
              </Pressable>
              <View style={styles.cardText}>
                <Text style={styles.name}>{item.name}</Text>
                {!!item.description && <Text style={styles.description}>{item.description}</Text>}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, padding: 16 },
  heading: { color: colors.textPrimary, fontFamily: fonts.family.bold, fontSize: sizes.xxl },
  subheading: { color: colors.textSecondary, fontFamily: fonts.family.regular, marginTop: 4 },
  list: { paddingTop: 20, gap: 10 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  empty: { color: colors.textMuted, fontFamily: fonts.family.regular, textAlign: 'center' },
  card: { alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, flexDirection: 'row', padding: 16 },
  check: { alignItems: 'center', borderColor: colors.border, borderRadius: 12, borderWidth: 2, height: 26, justifyContent: 'center', width: 26 },
  checkDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkText: { color: colors.textWhite, fontFamily: fonts.family.bold, fontSize: sizes.md },
  cardText: { flex: 1, marginLeft: 12 },
  name: { color: colors.textPrimary, fontFamily: fonts.family.semibold, fontSize: sizes.md },
  description: { color: colors.textSecondary, fontFamily: fonts.family.regular, fontSize: sizes.sm, marginTop: 2 },
});
