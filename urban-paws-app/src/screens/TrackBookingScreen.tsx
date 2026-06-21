import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { useApp } from '@/context/AppContext';
import { BookingStatus } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TrackBooking'>;

const STATUS_SEQUENCE: BookingStatus[] = [
  'confirmed',
  'on_the_way',
  'in_progress',
  'completed',
];

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending_confirmation: 'Waiting for confirmation',
  confirmed: 'Booking confirmed',
  on_the_way: 'Executive on the way',
  in_progress: 'Service in progress',
  completed: 'Service completed',
  cancelled: 'Cancelled',
};

export function TrackBookingScreen({ route, navigation }: Props) {
  const { bookingId } = route.params;
  const { state, dispatch } = useApp();
  const booking = state.bookings.find((b) => b.id === bookingId);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!booking) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = Math.min(prev + 1, STATUS_SEQUENCE.length - 1);
        dispatch({
          type: 'UPDATE_BOOKING_STATUS',
          bookingId: booking.id,
          status: STATUS_SEQUENCE[next],
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [booking?.id]);

  if (!booking) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>{booking.service.title}</Text>
          <Text style={styles.headerSub}>{STATUS_LABEL[STATUS_SEQUENCE[stepIndex]]}</Text>
        </View>
      </View>

      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={40} color={colors.muted} />
        <Text style={styles.mapText}>Live map tracking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.timeline}>
          {STATUS_SEQUENCE.map((status, i) => (
            <View key={status} style={styles.timelineRow}>
              <View style={styles.timelineMarkerCol}>
                <View
                  style={[
                    styles.timelineDot,
                    i <= stepIndex && styles.timelineDotActive,
                  ]}
                />
                {i < STATUS_SEQUENCE.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      i < stepIndex && styles.timelineLineActive,
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.timelineLabel,
                  i <= stepIndex && styles.timelineLabelActive,
                ]}
              >
                {STATUS_LABEL[status]}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.executiveCard}>
          <View style={styles.executiveAvatar}>
            <Ionicons name="person" size={22} color={colors.paw} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.executiveName}>Ravi Kumar</Text>
            <Text style={styles.executiveMeta}>4.8 ★ · Pet executive</Text>
          </View>
          <Pressable
            style={styles.callBtn}
            onPress={() => Linking.openURL('tel:+919876543210')}
          >
            <Ionicons name="call" size={18} color={colors.white} />
          </Pressable>
        </View>

        <Pressable style={styles.supportRow}>
          <Ionicons name="chatbubbles" size={18} color={colors.pawDeep} />
          <Text style={styles.supportText}>Chat with support</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.muted} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: {
    backgroundColor: colors.sage,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.white },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E5E0D8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mapText: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  timeline: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  timelineRow: { flexDirection: 'row', gap: spacing.sm },
  timelineMarkerCol: { alignItems: 'center', width: 16 },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border,
  },
  timelineDotActive: { backgroundColor: colors.sage },
  timelineLine: { width: 2, flex: 1, backgroundColor: colors.border, minHeight: 28 },
  timelineLineActive: { backgroundColor: colors.sage },
  timelineLabel: {
    fontSize: 13.5,
    color: colors.muted,
    paddingBottom: spacing.md,
  },
  timelineLabelActive: { color: colors.text, fontWeight: '600' },
  executiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  executiveAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.pawSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  executiveName: { fontSize: 14, fontWeight: '700', color: colors.night },
  executiveMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.pawSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  supportText: { fontSize: 13.5, fontWeight: '600', color: colors.pawDeep, flex: 1 },
});
