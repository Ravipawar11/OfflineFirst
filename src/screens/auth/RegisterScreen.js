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

export const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useContext(AuthContext);

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

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    if (!name.trim() || !trimmedEmail || !password) {
      Alert.alert('Missing details', 'Please enter your name, email, and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await register(trimmedEmail, password);
    } catch (error) {
      Alert.alert('Registration failed', error?.message || 'Please try again.');
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
              <MaterialCommunityIcons name="account-plus-outline" size={26} color={colors.primary} />
            </View>
            <CustomText variant="bold" size={sizes.xxl} color={colors.textPrimary} align="center" style={styles.title}>
              Create account
            </CustomText>
            <CustomText variant="regular" size={sizes.sm} color={colors.textSecondary} align="center" style={styles.subtitle}>
              Start your habit journey today — it only takes a minute
            </CustomText>
          </Animated.View>

          <Animated.View style={[styles.form, { opacity: formFade }]}>
            <CustomText variant="semibold" size={sizes.sm} color={colors.textPrimary} style={styles.label}>
              Full name
            </CustomText>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Jane Doe"
                placeholderTextColor={colors.textMuted || colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!submitting}
              />
            </View>

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
                placeholder="At least 6 characters"
                placeholderTextColor={colors.textMuted || colors.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!submitting}
              />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <CustomButton
              title="Create Account"
              onPress={handleRegister}
              loading={submitting}
              disabled={submitting}
              style={styles.button}
            />

            <View style={styles.footerRow}>
              <CustomText variant="regular" size={sizes.sm} color={colors.textSecondary}>
                Already have an account?{' '}
              </CustomText>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <CustomText variant="bold" size={sizes.sm} color={colors.primary}>
                  Sign in
                </CustomText>
              </TouchableOpacity>
            </View>
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
  button: { marginTop: 16, width: '100%', height: 54, borderRadius: 14 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 20,
  },
});