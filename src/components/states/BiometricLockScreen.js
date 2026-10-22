import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomButton, CustomText } from '../common';
import { colors, sizes, spacing } from '../../theme';

export const BiometricLockScreen = ({ error, onUnlock, isUnlocking }) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <Icon name="finger-print-outline" size={54} color={colors.primary} />
    </View>
    <CustomText variant="bold" size={sizes.lg} color={colors.textPrimary} style={styles.title}>
      Unlock TestingAppIOS
    </CustomText>
    <CustomText variant="regular" size={sizes.sm} color={colors.textMuted} style={styles.description}>
      Verify your identity with Face ID, Touch ID, or your device passcode to continue.
    </CustomText>
    {error ? (
      <CustomText variant="regular" size={sizes.xs} color={colors.error} style={styles.error}>
        {error}
      </CustomText>
    ) : null}
    <CustomButton
      title={isUnlocking ? 'Verifying…' : 'Unlock'}
      icon="lock-open-outline"
      onPress={onUnlock}
      loading={isUnlocking}
      fullWidth
      style={styles.unlockButton}
    />
    {isUnlocking && <ActivityIndicator color={colors.primary} style={styles.loader} />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  iconWrap: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '18',
  },
  title: { marginTop: spacing.lg, textAlign: 'center' },
  description: { marginTop: spacing.sm, textAlign: 'center', lineHeight: 21 },
  error: { marginTop: spacing.md, textAlign: 'center' },
  unlockButton: { marginTop: spacing.lg },
  loader: { marginTop: spacing.md },
});
