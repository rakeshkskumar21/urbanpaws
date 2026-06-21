import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/booking';
import { Button } from '@/components/Button';
import { PaymentMethod } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string }[] = [
  { id: 'upi', label: 'UPI (PhonePe / GPay)' },
  { id: 'cash', label: 'Cash on delivery' },
  { id: 'card', label: 'Debit / Credit Card' },
  { id: 'wallet', label: 'Urban Paws Wallet' },
];

export function CheckoutScreen({ navigation }: Props) {
  const { state, dispatch, cartTotal } = useApp();
  const [payment, setPayment] = useState<PaymentMethod>('upi');
  const [placed, setPlaced] = useState(false);
  const defaultAddress = state.addresses.find((a) => a.isDefault) ?? state.addresses[0];

  const deliveryFee = 25;
  const grandTotal = cartTotal + deliveryFee;

  if (placed) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successWrap}>
          <Ionicons name="checkmark-circle" size={72} color={colors.sage} />
          <Text style={styles.successTitle}>Order placed!</Text>
          <Text style={styles.successSub}>
            Your order will be delivered in 30–35 minutes
          </Text>
          <Button
            label="Back to home"
            onPress={() => {
              dispatch({ type: 'CLEAR_CART' });
              navigation.popToTop();
            }}
            style={{ marginTop: spacing.lg, width: '100%' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Delivery address</Text>
        <View style={styles.addressCard}>
          <Ionicons name="home" size={16} color={colors.paw} />
          <Text style={styles.addressText}>
            {defaultAddress
              ? `${defaultAddress.line}, ${defaultAddress.city}`
              : 'Add an address'}
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
          Payment method
        </Text>
        <View style={styles.paymentList}>
          {PAYMENT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => setPayment(opt.id)}
              style={[styles.paymentRow, payment === opt.id && styles.paymentRowActive]}
            >
              <Text style={styles.paymentLabel}>{opt.label}</Text>
              <View style={styles.radioOuter}>
                {payment === opt.id && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>{formatCurrency(cartTotal)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery fee</Text>
            <Text style={styles.billValue}>{formatCurrency(deliveryFee)}</Text>
          </View>
          <View style={styles.billDivider} />
          <View style={styles.billRow}>
            <Text style={styles.billLabelBold}>Grand total</Text>
            <Text style={styles.billValueBold}>{formatCurrency(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={`Place order · ${formatCurrency(grandTotal)}`}
          onPress={() => setPlaced(true)}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.night },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.paw,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  addressText: { fontSize: 13.5, color: colors.text, flex: 1 },
  paymentList: { gap: spacing.xs },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  paymentRowActive: { borderColor: colors.paw },
  paymentLabel: { fontSize: 13.5, color: colors.text },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.paw },
  billCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  billLabel: { fontSize: 13, color: colors.muted },
  billValue: { fontSize: 13, color: colors.text, fontWeight: '500' },
  billLabelBold: { fontSize: 14, fontWeight: '700', color: colors.text },
  billValueBold: { fontSize: 16, fontWeight: '800', color: colors.paw },
  billDivider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  successTitle: { fontSize: 22, fontWeight: '800', color: colors.night, marginTop: spacing.md },
  successSub: { fontSize: 13.5, color: colors.muted, textAlign: 'center', marginTop: 4 },
});
