import React, { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useSyncStatus } from '../../context/SyncContext';
import { getHabits } from '../../services/habitRepository';
import { colors, fonts, sizes } from '../../theme';

export const HabitsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { refreshPendingCount } = useSyncStatus();
  const [habits, setHabits] = useState([]);

  const load = useCallback(async () => {
    if (user) {
      setHabits(await getHabits(user.uid));
      await refreshPendingCount();
    }
  }, [user, refreshPendingCount]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <Text style={styles.add} onPress={() => navigation.navigate('HabitForm')}>Add</Text> });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={habits.length ? styles.list : styles.emptyList}
        ListEmptyComponent={<Text style={styles.empty}>Create your first habit to start tracking offline.</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('HabitDetails', { habitId: item.id })}>
            <View style={styles.cardText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.frequency === 'weekly' ? `${item.target_per_week} times per week` : 'Daily'}</Text>
            </View>
            <Text style={styles.edit} onPress={() => navigation.navigate('HabitForm', { habitId: item.id })}>Edit</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, flex: 1, padding: 16 },
  list: { gap: 10 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  empty: { color: colors.textMuted, fontFamily: fonts.family.regular, textAlign: 'center' },
  card: { alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, flexDirection: 'row', padding: 16 },
  cardText: { flex: 1 },
  name: { color: colors.textPrimary, fontFamily: fonts.family.semibold, fontSize: sizes.md },
  meta: { color: colors.textSecondary, fontFamily: fonts.family.regular, fontSize: sizes.sm, marginTop: 3 },
  add: { color: colors.textWhite, fontFamily: fonts.family.semibold, fontSize: sizes.md, marginRight: 14 },
  edit: { color: colors.primary, fontFamily: fonts.family.semibold, padding: 6 },
});
