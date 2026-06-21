import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { Button } from '@/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [mobile, setMobile] = useState('');

  const isValid = mobile.replace(/\D/g, '').length === 10;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.pawIcon}>🐾</Text>
          <Text style={styles.title}>Urban Paws</Text>
          <Text style={styles.subtitle}>
            Enter your phone number to register or sign in
          </Text>

          <Text style={styles.label}>Phone number</Text>
          <View style={styles.inputRow}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              value={mobile}
              onChangeText={(t) => setMobile(t.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              style={styles.input}
              maxLength={10}
            />
          </View>

          <Button
            label="Send OTP"
            onPress={() => navigation.navigate('OtpVerify', { mobile })}
            disabled={!isValid}
            style={{ marginTop: spacing.lg, width: '100%' }}
          />

          <Text style={styles.terms}>
            By continuing, you agree to Urban Paws' Terms of Service and Privacy
            Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  pawIcon: { fontSize: 48, textAlign: 'center', marginBottom: spacing.sm },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.night,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  terms: {
    fontSize: 11.5,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 17,
  },
});
