import React from 'react';
import { PlatformPressable } from '@react-navigation/elements';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const HapticTab = (props) => {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        ReactNativeHapticFeedback.trigger('impactLight', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
        props.onPressIn?.(ev);
      }}
    />
  );
};