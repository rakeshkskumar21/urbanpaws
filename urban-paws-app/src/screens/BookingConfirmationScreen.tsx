import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatTimeSlot } from '@/utils/booking';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingConfirmation'>;

export function BookingConfirmationScreen({ route, navigation }: Props) {
  const { bookingId } = route.params;
  const { state } = useApp();
  const booking = state.bookings.find((b) => b.id === bookingId);
  const address = state.addresses.find((a) => a.id === booking?.addressId);

  if (!booking) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.checkWrap}>
          <Ionicons name="checkmark-circle" size={72} color={colors.sage} />
        </View>
        <Text style={styles.title}>Booking confirmed!</Text>
        <Text style={styles.subtitle}>
          Great, your appointment for {booking.service.title.toLowerCase()} has been
          confirmed. Our pet executive will arrive in your selected slot.
        </Text>

        <View style={styles.otpCard}>
          <Text style={styles.otpLabel}>Your OTP</Text>
          <Text style={styles.otpValue}>{booking.otp}</Text>
          <Text style={styles.otpNote}>
            Share this with your pet executive to start the service
          </Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Order details</Text>
          <DetailRow label={booking.service.title} value={formatCurrency(booking.subtotal)} />
          <DetailRow label="Time slot" value={formatTimeSlot(booking.timeSlot)} />
          <DetailRow label="Address" value={address ? `${address.line}, ${address.city}` : '—'} />
          <DetailRow label="Platform fee" value={formatCurrency(booking.platformFee)} />
          <DetailRow label="Partner fee" value={formatCurrency(booking.partnerFee)} />
          {booking.tip > 0 && <DetailRow label="Tip" value={formatCurrency(booking.tip)} />}
          <View style={styles.divider} />
          <DetailRow label="Grand total" value={formatCurrency(booking.grandTotal)} bold />
          <View style={styles.paidRow}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.paidText}>Payment confirmed</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Track booking →"
          onPress={() => navigation.replace('TrackBooking', { bookingId: booking.id })}
          style={{ width: '100%', marginBottom: spacing.sm }}
        />
        <Button
          label="Back to home"
          variant="outline"
          onPress={() => navigation.popToTop()}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, bold && styles.detailLabelBold]}>{label}</Text>
      <Text style={[styles.detailValue, bold && styles.detailValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, alignItems: 'center' },
  checkWrap: { marginTop: spacing.lg, marginBottom: spacing.sm },
  title: { fontSize: 22, fontWeight: '800', color: colors.night, textAlign: 'center' },
  subtitle: {
    fontSize: 13.5,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  otpCard: {
    backgroundColor: colors.night,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.md,
  },
  otpLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  otpValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 8,
    marginVertical: spacing.xs,
  },
  otpNote: { fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  detailsCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    width: '100%',
  },
  detailsTitle: { fontSize: 13, fontWeight: '700', color: colors.night, marginBottom: spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  detailLabel: { fontSize: 13, color: colors.muted, flexShrink: 1 },
  detailLabelBold: { fontWeight: '700', color: colors.text, fontSize: 14 },
  detailValue: { fontSize: 13, color: colors.text, fontWeight: '500', textAlign: 'right', flexShrink: 1, marginLeft: spacing.sm },
  detailValueBold: { fontWeight: '800', color: colors.paw, fontSize: 15 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  paidRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
  paidText: { fontSize: 12, color: colors.success, fontWeight: '600' },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
