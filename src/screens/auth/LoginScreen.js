import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../context/AuthContext';
import { CustomButton, CustomText } from '../../components/common';
import { colors, fonts, sizes } from '../../theme';

const { width } = Dimensions.get('window');

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useContext(AuthContext);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const formFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(formFade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (submitting) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert('Missing details', 'Please enter both email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(trimmedEmail, password);
    } catch (e) {
      const msg =
        e?.code === 'auth/invalid-credential' ||
        e?.code === 'auth/wrong-password' ||
        e?.code === 'auth/user-not-found'
          ? 'Incorrect email or password.'
          : e?.code === 'auth/network-request-failed'
          ? 'Network unavailable. Please check your connection.'
          : e?.message || 'Login failed. Please try again.';
      Alert.alert('Login failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.accentCircle} />
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="star-four-points" size={26} color={colors.primary} />
            </View>
            <CustomText variant="bold" size={sizes.xxl} color={colors.textPrimary} align="center" style={styles.title}>
              Welcome back
            </CustomText>
            <CustomText variant="regular" size={sizes.sm} color={colors.textSecondary} align="center" style={styles.subtitle}>
              Sign in to continue building your best habits
            </CustomText>
          </Animated.View>

          <Animated.View style={[styles.form, { opacity: formFade }]}>
            <CustomText variant="semibold" size={sizes.sm} color={colors.textPrimary} style={styles.label}>
              Email
            </CustomText>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted || colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!submitting}
                returnKeyType="next"
              />
            </View>

            <CustomText variant="semibold" size={sizes.sm} color={colors.textPrimary} style={styles.label}>
              Password
            </CustomText>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted || colors.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!submitting}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPasswordContainer} disabled={submitting}>
              <CustomText variant="semibold" size={sizes.sm} color={colors.primary}>
                Forgot password?
              </CustomText>
            </TouchableOpacity>

            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              loading={submitting}
              disabled={submitting}
              style={styles.button}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <CustomText variant="regular" size={sizes.sm} color={colors.textSecondary} style={styles.dividerText}>
                or continue with
              </CustomText>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} disabled={submitting}>
                <MaterialCommunityIcons name="apple" size={22} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} disabled={submitting}>
                <MaterialCommunityIcons name="google" size={22} color="#EA4335" />
              </TouchableOpacity>
            </View>

            <View style={styles.footerRow}>
              <CustomText variant="regular" size={sizes.sm} color={colors.textSecondary}>
                Don't have an account?{' '}
              </CustomText>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                disabled={submitting}
              >
                <CustomText variant="bold" size={sizes.sm} color={colors.primary}>
                  Sign up
                </CustomText>
              </TouchableOpacity>
            </View>

            <CustomText variant="regular" size={sizes.xs} color={colors.textSecondary} align="center" style={styles.terms}>
              By continuing, I agree to the{' '}
              <CustomText variant="regular" size={sizes.xs} color={colors.textPrimary} style={styles.termsLink}>Terms</CustomText> &{' '}
              <CustomText variant="regular" size={sizes.xs} color={colors.textPrimary} style={styles.termsLink}>Privacy Policy</CustomText>
            </CustomText>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 24, paddingTop: 32, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32, position: 'relative' },
  accentCircle: {
    position: 'absolute',
    top: -80,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(76,175,80,0.08)',
    alignSelf: 'center',
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(76,175,80,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { marginBottom: 8 },
  subtitle: { lineHeight: 20, paddingHorizontal: 20 },
  form: { width: '100%' },
  label: { marginBottom: 8, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: sizes.md,
    color: colors.textPrimary,
    height: '100%',
    fontFamily: fonts?.family?.regular || undefined,
  },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginBottom: 24 },
  button: { width: '100%', height: 54, borderRadius: 14, marginBottom: 20 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: 12 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  terms: { lineHeight: 16, marginTop: 20, paddingHorizontal: 12 },
  termsLink: { textDecorationLine: 'underline' },
});