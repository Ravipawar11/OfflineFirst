import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base resolution (based on standard iPhone 11/X width)
const baseWidth = 375;

export const scale = (size) => (SCREEN_WIDTH / baseWidth) * size;

export const dimensions = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};
