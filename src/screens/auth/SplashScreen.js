import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomText } from '../../components/common';
import { colors, sizes } from '../../theme';

const { width } = Dimensions.get('window');

export const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(60)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const badgeFade = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(taglineFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(badgeFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(progressAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
    ]).start(() => {
      setTimeout(() => onFinish && onFinish(), 300);
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgCircleLarge} />
      <View style={styles.bgCircleSmall} />

      <Animated.View
        style={[
          styles.logoWrapper,
          { opacity: fadeAnim, transform: [{ translateY: slideUp }] },
        ]}
      >
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="star-four-points" size={42} color="#FFF" />
        </View>
        <CustomText variant="bold" size={sizes.xxxl} color="#FFF" align="center" style={styles.title}>
          Bloom
        </CustomText>
        <Animated.View style={{ opacity: taglineFade }}>
          <CustomText variant="regular" size={sizes.md} color="rgba(255,255,255,0.85)" align="center">
            Build habits. Track progress. Grow daily.
          </CustomText>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.featureRow, { opacity: badgeFade }]}>
        <Feature icon="check-circle-outline" label="Habits" />
        <Feature icon="chart-line" label="Insights" />
        <Feature icon="fire" label="Streaks" />
      </Animated.View>

      <View style={styles.bottom}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
        <CustomText variant="regular" size={sizes.xs} color="rgba(255,255,255,0.8)" align="center" style={styles.loadingText}>
          Getting things ready…
        </CustomText>
      </View>
    </View>
  );
};

const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <MaterialCommunityIcons name={icon} size={22} color="#FFF" />
    <CustomText variant="semibold" size={sizes.xs} color="rgba(255,255,255,0.9)" align="center" style={styles.featureLabel}>
      {label}
    </CustomText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  bgCircleLarge: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -width * 0.5,
    right: -width * 0.4,
  },
  bgCircleSmall: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -width * 0.3,
    left: -width * 0.25,
  },
  logoWrapper: { alignItems: 'center' },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: { letterSpacing: 1, marginBottom: 12 },
  featureRow: { flexDirection: 'row', marginTop: 48, gap: 28 },
  featureItem: { alignItems: 'center' },
  featureLabel: { marginTop: 6 },
  bottom: {
    position: 'absolute',
    bottom: 60,
    width: '80%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: '#FFF', borderRadius: 2 },
  loadingText: { marginTop: 14 },
});