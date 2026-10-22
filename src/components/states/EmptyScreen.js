import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomText } from '../common/CustomText';
import { CustomButton } from '../common/CustomButton';
import { colors, sizes, spacing, strings } from '../../theme';

export const EmptyScreen = ({
  title = strings.empty.title,
  subtitle = strings.empty.subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <CustomText variant="semibold" size={sizes.xl} color={colors.textPrimary} align="center">
        {title}
      </CustomText>
      <CustomText variant="regular" size={sizes.md} color={colors.textMuted} align="center" style={styles.subtitle}>
        {subtitle}
      </CustomText>
      {actionLabel && onAction && (
        <CustomButton
          title={actionLabel}
          onPress={onAction}
          variant="outline"
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
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  button: {
    minWidth: 160,
  },
});