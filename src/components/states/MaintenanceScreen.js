import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomText } from '../common/CustomText';
import { colors, sizes, spacing, strings } from '../../theme';

export const MaintenanceScreen = () => {
  return (
    <View style={styles.container}>
      <CustomText variant="bold" size={sizes.xxl} color={colors.primary} align="center">
        {strings.maintenance.title}
      </CustomText>
      <CustomText variant="regular" size={sizes.md} color={colors.textSecondary} align="center" style={styles.subtitle}>
        {strings.maintenance.subtitle}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.md,
  },
});