import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getHabit, getStreak, getLogsForRange } from '../../services/habitRepository';
import { todayStr } from '../../utils/date';
import { colors, fonts, sizes } from '../../theme';

export const HabitDetailsScreen = ({ route }) => {
  const { user } = useAuth();
  const { habitId } = route.params;
  const [habit, setHabit] = useState(null);
  const [streak, setStreak] = useState(0);
  const [last7, setLast7] = useState([]);

  const load = useCallback(async () => {
    setHabit(await getHabit(habitId));
    setStreak(await getStreak(user.uid, habitId));

    const end = todayStr();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    const startStr = start.toISOString().slice(0, 10);
    setLast7(await getLogsForRange(user.uid, habitId, startStr, end));
  }, [habitId, user.uid]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (!habit) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{habit.name}</Text>
      {!!habit.description && <Text style={styles.desc}>{habit.description}</Text>}

      <View style={styles.statCard}>
        <Text style={styles.statValue}>{streak}</Text>
        <Text style={styles.statLabel}>day streak 🔥</Text>
      </View>

      <Text style={styles.section}>Last 7 days</Text>
      <View style={styles.weekRow}>
        {last7.map((log) => (
          <View
            key={log.id}
            style={[styles.dayDot, log.completed && styles.dayDotDone]}
          >
            <Text style={styles.dayText}>{log.date.slice(-2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', padding: 16 },
  title: { fontFamily: fonts.family.semibold, fontSize: sizes.xl, color: colors.text },
  desc: { fontFamily: fonts.family.regular, fontSize: sizes.md, color: colors.textMuted, marginTop: 4 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginTop: 20, alignItems: 'center' },
  statValue: { fontFamily: fonts.family.semibold, fontSize: 36, color: colors.primary },
  statLabel: { fontFamily: fonts.family.regular, color: colors.textMuted, marginTop: 4 },
  section: { fontFamily: fonts.family.semibold, fontSize: sizes.md, color: colors.text, marginTop: 24, marginBottom: 12 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayDot: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  dayDotDone: { backgroundColor: colors.primary },
  dayText: { fontFamily: fonts.family.medium, fontSize: sizes.xs, color: '#fff' },
});