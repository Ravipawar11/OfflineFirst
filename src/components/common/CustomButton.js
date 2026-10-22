import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, View } from 'react-native';
import { CustomText } from './CustomText';
import { colors, sizes, spacing } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const CustomButton = ({
  title,
  onPress,
  variant = 'primary',   // primary | secondary | outline
  size = 'md',           // sm | md | lg
  disabled = false,
  loading = false,
  icon,                  // Ionicons name, e.g. "cart-outline"
  iconPosition = 'left', // left | right
  iconSize,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'secondary': return colors.secondary;
      case 'outline':   return 'transparent';
      default:          return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    if (variant === 'outline') return colors.primary;
    return colors.textWhite;
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 36;
      case 'lg': return 54;
      default:   return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return sizes.xs;
      case 'lg': return sizes.md;
      default:   return sizes.sm;
    }
  };

  const getIconSize = () => {
    if (iconSize) return iconSize;
    switch (size) {
      case 'sm': return 14;
      case 'lg': return 22;
      default:   return 18;
    }
  };

  const iconColor = getTextColor();

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={iconColor} />;
    }

    const label = (
      <CustomText
        variant="semibold"
        size={getFontSize()}
        color={iconColor}
        style={textStyle}
      >
        {title}
      </CustomText>
    );

    if (!icon) return label;

    const iconEl = (
      <Ionicons
        name={icon}
        size={getIconSize()}
        color={iconColor}
        style={
          iconPosition === 'left'
            ? { marginRight: spacing.sm }
            : { marginLeft: spacing.sm }
        }
      />
    );

    return (
      <View style={styles.contentRow}>
        {iconPosition === 'left' && iconEl}
        {label}
        {iconPosition === 'right' && iconEl}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor(), height: getHeight() },
        variant === 'outline' && styles.outline,
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: sizes.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});