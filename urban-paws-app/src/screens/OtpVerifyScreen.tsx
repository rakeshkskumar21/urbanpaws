import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { Button } from '@/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerify'>;

const OTP_LENGTH = 4;

export function OtpVerifyScreen({ route, navigation }: Props) {
  const { mobile } = route.params;
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const next = [...digits];
    next[index] = text.replace(/\D/g, '').slice(-1);
    setDigits(next);
    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const isComplete = digits.every((d) => d.length === 1);

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We sent a 4-digit code to +91 {mobile}
        </Text>

        <View style={styles.otpRow}>
          {digits.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => (inputs.current[i] = ref)}
              value={digit}
              onChangeText={(t) => handleChange(t, i)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpBox}
            />
          ))}
        </View>

        <Pressable style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive? Resend OTP</Text>
        </Pressable>

        <Button
          label="Verify & continue"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] })}
          disabled={!isComplete}
          style={{ marginTop: spacing.xl, width: '100%' }}
        />

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.editLink}>Edit phone number</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  backBtn: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  title: { fontSize: 26, fontWeight: '800', color: colors.night },
  subtitle: { fontSize: 13.5, color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.xl },
  otpRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  otpBox: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.cardBg,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  resendRow: { marginTop: spacing.xs },
  resendText: { fontSize: 13, fontWeight: '600', color: colors.paw },
  editLink: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.md,
    textDecorationLine: 'underline',
  },
});
