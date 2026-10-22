import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../../theme';

export const CustomText = ({
  children,
  variant = 'regular', // light | regular | medium | semibold | bold
  size = sizes.md,
  color = colors.textPrimary,
  align = 'left',
  style,
  ...props
}) => {
  return (
    <Text
      style={[
        styles.text,
        {
          fontFamily: fonts.family[variant] || fonts.family.regular,
          fontSize: size,
          color,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});