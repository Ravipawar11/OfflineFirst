import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { CustomText } from '../common/CustomText';
import { colors, sizes, spacing, strings } from '../../theme';

export const LoadingScreen = ({ message = strings.common.loading }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <CustomText variant="medium" size={sizes.md} color={colors.textSecondary} style={styles.text}>
        {message}
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
    padding: spacing.lg,
  },
  text: {
    marginTop: spacing.md,
  },
});