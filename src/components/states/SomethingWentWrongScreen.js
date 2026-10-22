import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomText } from '../common/CustomText';
import { CustomButton } from '../common/CustomButton';
import { colors, sizes, spacing, strings } from '../../theme';

export const SomethingWentWrongScreen = ({ onRetry, title, subtitle }) => {
  return (
    <View style={styles.container}>
      <CustomText variant="bold" size={sizes.xxl} color={colors.error} align="center">
        {title || strings.errors.somethingWrongTitle}
      </CustomText>
      <CustomText variant="regular" size={sizes.md} color={colors.textSecondary} align="center" style={styles.subtitle}>
        {subtitle || strings.errors.somethingWrongSubtitle}
      </CustomText>
      {onRetry && (
        <CustomButton
          title={strings.common.retry}
          onPress={onRetry}
          style={styles.button}
        />
      )}
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
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  button: {
    width: '100%',
  },
});