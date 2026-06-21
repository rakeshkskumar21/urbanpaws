import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatTimeSlot } from '@/utils/booking';
import { Badge } from '@/components/Badge';
import { BookingStatus } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'YourOrders'>;

const STATUS_VARIANT: Record<BookingStatus, 'default' | 'success' | 'danger' | 'dark'> = {
  pending_confirmation: 'default',
  confirmed: 'success',
  on_the_way: 'default',
  in_progress: 'default',
  completed: 'success',
  cancelled: 'danger',
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending_confirmation: 'Pending',
  confirmed: 'Confirmed',
  on_the_way: 'On the way',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function YourOrdersScreen({ navigation }: Props) {
  const { state } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Your orders</Text>
        <View style={{ width: 36 }} />
      </View>

      {state.bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySub}>Your booking history will show up here</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {state.bookings.map((booking) => (
            <Pressable
              key={booking.id}
              style={styles.orderCard}
              onPress={() => navigation.navigate('TrackBooking', { bookingId: booking.id })}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>{booking.service.title}</Text>
                <Badge
                  label={STATUS_LABEL[booking.status]}
                  variant={STATUS_VARIANT[booking.status]}
                />
              </View>
              <Text style={styles.orderMeta}>
                {booking.date} · {formatTimeSlot(booking.timeSlot)}
              </Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>{formatCurrency(booking.grandTotal)}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
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
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.night, marginTop: spacing.md },
  emptySub: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 4 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  orderCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTitle: { fontSize: 14.5, fontWeight: '700', color: colors.night },
  orderMeta: { fontSize: 12, color: colors.muted, marginTop: 6 },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  orderTotal: { fontSize: 14, fontWeight: '800', color: colors.paw },
});
