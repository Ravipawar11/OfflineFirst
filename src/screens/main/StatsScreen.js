import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getHabits, getLogsForRange } from '../../services/habitRepository';
import { formatDate, todayStr } from '../../utils/date';
import { colors, fonts, sizes } from '../../theme';

export const StatsScreen = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ completed: 0, total: 0 });

  const load = useCallback(async () => {
    if (!user) return;
    const habits = await getHabits(user.uid);
    const start = new Date();
    start.setDate(start.getDate() - 6);
    const logGroups = await Promise.all(habits.map((habit) => getLogsForRange(user.uid, habit.id, formatDate(start), todayStr())));
    const completed = logGroups.flat().filter((log) => log.completed === 1).length;
    setStats({ completed, total: habits.length * 7 });
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  const rate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return <View style={styles.container}>
    <Text style={styles.title}>This week</Text>
    <View style={styles.card}><Text style={styles.value}>{rate}%</Text><Text style={styles.label}>completion rate</Text></View>
    <View style={styles.card}><Text style={styles.value}>{stats.completed}</Text><Text style={styles.label}>completed habits in the last 7 days</Text></View>
  </View>;
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, flex: 1, padding: 16 },
  title: { color: colors.textPrimary, fontFamily: fonts.family.bold, fontSize: sizes.xl, marginBottom: 16 },
  card: { alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, marginBottom: 12, padding: 24 },
  value: { color: colors.primary, fontFamily: fonts.family.bold, fontSize: 36 },
  label: { color: colors.textSecondary, fontFamily: fonts.family.regular, marginTop: 4, textAlign: 'center' },
});
