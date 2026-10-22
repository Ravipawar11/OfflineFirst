import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useSyncStatus } from '../../context/SyncContext';
import { createHabit, updateHabit, getHabit } from '../../services/habitRepository';
import { colors, fonts, sizes } from '../../theme';

export const HabitFormScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { isOnline, runSync, refreshPendingCount } = useSyncStatus();
  const habitId = route.params?.habitId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [target, setTarget] = useState('7');

  React.useEffect(() => {
    if (habitId) {
      getHabit(habitId).then((h) => {
        if (!h) return;
        setName(h.name);
        setDescription(h.description ?? '');
        setFrequency(h.frequency ?? 'daily');
        setTarget(String(h.target_per_week ?? 7));
      });
    }
  }, [habitId]);

  const onSave = async () => {
    if (!name.trim()) return Alert.alert('Name required');
    const data = {
      name: name.trim(),
      description: description.trim() || null,
      frequency,
      target_per_week: Number(target) || 7,
    };
    try {
      if (habitId) await updateHabit(habitId, data);
      else await createHabit(user.uid, data);
      await refreshPendingCount();
      if (isOnline) runSync();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not save habit', error?.message || 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} 
      value={name} onChangeText={setName} 
       placeholder='Enter Description'
        placeholderTextColor='gray'/>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder='Enter Description'
        placeholderTextColor='gray'
        multiline
      />

      <Text style={styles.label}>Frequency</Text>
      <View style={styles.row}>
        {['daily', 'weekly'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, frequency === f && styles.chipActive]}
            onPress={() => setFrequency(f)}
          >
            <Text style={[styles.chipText, frequency === f && { color: '#fff' }]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Target per week</Text>
      <TextInput
        style={styles.input}
        value={target}
        onChangeText={setTarget}
        keyboardType="number-pad"
        placeholder='Enter Description'
        placeholderTextColor='gray'
      />

      <TouchableOpacity style={styles.save} onPress={onSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({  
  container: { flex: 1, backgroundColor: '#F7F8FA', padding: 16 },
  label: { fontFamily: fonts.family.medium, fontSize: sizes.sm, color: colors.text, marginTop: 14, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: sizes.md, fontFamily: fonts.family.regular },
  row: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff' },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontFamily: fonts.family.medium, color: colors.text },
  save: { marginTop: 24, backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  saveText: { color: '#fff', fontFamily: fonts.family.semibold, fontSize: sizes.md },
});
