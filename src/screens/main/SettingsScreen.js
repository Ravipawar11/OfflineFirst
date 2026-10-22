import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSyncStatus } from '../../context/SyncContext';
import { AuthContext } from '../../context/AuthContext';
import { CustomText } from '../../components/common';
import { colors, sizes } from '../../theme';

export const SettingsScreen = () => {
  const { isOnline, isSyncing, pendingCount, runSync } = useSyncStatus();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (e) {
            Alert.alert('Logout failed', e?.message || 'Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <CustomText variant="medium" size={sizes.md} color={colors.text}>
          Connection
        </CustomText>
        <CustomText variant="regular" size={sizes.md} color={colors.textMuted}>
          {isOnline ? 'Online' : 'Offline'}
        </CustomText>
      </View>
      <View style={styles.row}>
        <CustomText variant="medium" size={sizes.md} color={colors.text}>
          Pending changes
        </CustomText>
        <CustomText variant="regular" size={sizes.md} color={colors.textMuted}>
          {pendingCount}
        </CustomText>
      </View>

      <TouchableOpacity
        style={[styles.button, (!isOnline || isSyncing) && { opacity: 0.5 }]}
        disabled={!isOnline || isSyncing}
        onPress={runSync}
      >
        <CustomText variant="semibold" size={sizes.md} color="#fff">
          {isSyncing ? 'Syncing…' : 'Sync Now'}
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={20} color="#D32F2F" />
        <CustomText variant="semibold" size={sizes.md} color="#D32F2F" style={styles.logoutText}>
          Log out
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', padding: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5C6C6',
  },
  logoutText: { marginLeft: 8 },
});