import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { SERVICES } from '@/data/services';
import { BREEDS } from '@/data/shop';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { buildBooking, formatCurrency, formatTimeSlot } from '@/utils/booking';
import { TimeSlot, PaymentMethod } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingFlow'>;

const TIME_SLOTS: TimeSlot[] = [
  '06:00-07:00',
  '07:00-08:00',
  '08:00-09:00',
  '09:00-10:00',
  '16:00-17:00',
  '17:00-18:00',
  '18:00-19:00',
];

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'upi', label: 'UPI (PhonePe / GPay)', icon: 'phone-portrait' },
  { id: 'cash', label: 'Cash on delivery', icon: 'cash' },
  { id: 'card', label: 'Debit / Credit Card', icon: 'card' },
  { id: 'wallet', label: 'Urban Paws Wallet', icon: 'wallet' },
];

export function BookingFlowScreen({ route, navigation }: Props) {
  const { serviceId } = route.params;
  const service = SERVICES.find((s) => s.id === serviceId);
  const { state, dispatch } = useApp();

  const activePet = state.pets.find((p) => p.id === state.selectedPetId);
  const defaultAddress = state.addresses.find((a) => a.isDefault) ?? state.addresses[0];

  const [breed, setBreed] = useState(activePet?.breed ?? '');
  const [breedPickerOpen, setBreedPickerOpen] = useState(false);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('08:00-09:00');
  const [payment, setPayment] = useState<PaymentMethod>('upi');
  const [instructions, setInstructions] = useState('');
  const [tip, setTip] = useState(0);

  if (!service) return null;

  const today = new Date().toISOString().split('T')[0];
  const subtotal = service.priceFrom;
  const grandTotal = subtotal + 1 + 2 + tip;

  const handleConfirm = () => {
    if (!activePet || !defaultAddress) return;
    const booking = buildBooking({
      petId: activePet.id,
      service,
      date: today,
      timeSlot,
      addressId: defaultAddress.id,
      paymentMethod: payment,
      tip,
      specialInstructions: instructions || undefined,
    });
    dispatch({ type: 'ADD_BOOKING', booking });
    navigation.replace('BookingConfirmation', { bookingId: booking.id });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Book {service.title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Pet details</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Pet name</Text>
          <TextInput
            value={activePet?.name}
            editable={false}
            style={styles.input}
          />
        </View>
        <Pressable style={styles.fieldGroup} onPress={() => setBreedPickerOpen(true)}>
          <Text style={styles.fieldLabel}>Breed</Text>
          <View style={styles.selectInput}>
            <Text style={breed ? styles.selectValue : styles.selectPlaceholder}>
              {breed || 'Select your pet breed'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.muted} />
          </View>
        </Pressable>

        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
          Address & schedule
        </Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Your address</Text>
          <View style={styles.addressCard}>
            <Ionicons name="home" size={16} color={colors.paw} />
            <Text style={styles.addressText}>
              {defaultAddress
                ? `${defaultAddress.line}, ${defaultAddress.city}`
                : 'Add an address'}
            </Text>
          </View>
        </View>

        <Text style={styles.fieldLabel}>Time slot</Text>
        <View style={styles.slotGrid}>
          {TIME_SLOTS.map((slot) => (
            <Pressable
              key={slot}
              onPress={() => setTimeSlot(slot)}
              style={[styles.slotChip, timeSlot === slot && styles.slotChipActive]}
            >
              <Text
                style={[
                  styles.slotChipText,
                  timeSlot === slot && styles.slotChipTextActive,
                ]}
              >
                {formatTimeSlot(slot)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
          Add a tip
        </Text>
        <View style={styles.tipRow}>
          {[5, 10, 20].map((amt) => (
            <Pressable
              key={amt}
              onPress={() => setTip(amt)}
              style={[styles.tipChip, tip === amt && styles.tipChipActive]}
            >
              <Text
                style={[styles.tipChipText, tip === amt && styles.tipChipTextActive]}
              >
                ₹{amt}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => setTip(0)}
            style={[styles.tipChip, tip === 0 && styles.tipChipActive]}
          >
            <Text style={[styles.tipChipText, tip === 0 && styles.tipChipTextActive]}>
              None
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
          Payment method
        </Text>
        <View style={styles.paymentList}>
          {PAYMENT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => setPayment(opt.id)}
              style={[
                styles.paymentRow,
                payment === opt.id && styles.paymentRowActive,
              ]}
            >
              <Ionicons name={opt.icon} size={18} color={colors.text} />
              <Text style={styles.paymentLabel}>{opt.label}</Text>
              <View style={styles.radioOuter}>
                {payment === opt.id && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
          Special instructions
        </Text>
        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          placeholder="e.g. Bruno gets anxious around loud sounds..."
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textarea]}
        />

        <View style={styles.billCard}>
          <Text style={styles.billTitle}>Bill summary</Text>
          <BillRow label={`${service.title}`} value={formatCurrency(subtotal)} />
          <BillRow label="Platform fee" value={formatCurrency(1)} />
          <BillRow label="Partner fee (1km)" value={formatCurrency(2)} />
          {tip > 0 && <BillRow label="Tip" value={formatCurrency(tip)} />}
          <View style={styles.billDivider} />
          <BillRow label="Grand total" value={formatCurrency(grandTotal)} bold />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={`Confirm booking · ${formatCurrency(grandTotal)}`}
          onPress={handleConfirm}
          style={{ width: '100%' }}
        />
      </View>

      <Modal visible={breedPickerOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select breed</Text>
            <FlatList
              data={BREEDS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.breedRow}
                  onPress={() => {
                    setBreed(item);
                    setBreedPickerOpen(false);
                  }}
                >
                  <Text style={styles.breedText}>{item}</Text>
                  {breed === item && (
                    <Ionicons name="checkmark" size={18} color={colors.paw} />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function BillRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, bold && styles.billLabelBold]}>{label}</Text>
      <Text style={[styles.billValue, bold && styles.billValueBold]}>{value}</Text>
    </View>
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
  fieldGroup: { marginBottom: spacing.md },
  fieldLabel: { fontSize: 12.5, fontWeight: '600', color: colors.muted, marginBottom: 6 },
  input: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14.5,
    color: colors.text,
  },
  textarea: { height: 80, textAlignVertical: 'top' },
  selectInput: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectValue: { fontSize: 14.5, color: colors.text },
  selectPlaceholder: { fontSize: 14.5, color: colors.muted },
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
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: 8 },
  slotChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
  },
  slotChipActive: { backgroundColor: colors.paw, borderColor: colors.paw },
  slotChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  slotChipTextActive: { color: colors.white },
  tipRow: { flexDirection: 'row', gap: spacing.sm },
  tipChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
  },
  tipChipActive: { backgroundColor: colors.paw, borderColor: colors.paw },
  tipChipText: { fontSize: 13, fontWeight: '700', color: colors.text },
  tipChipTextActive: { color: colors.white },
  paymentList: { gap: spacing.xs },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  paymentRowActive: { borderColor: colors.paw },
  paymentLabel: { fontSize: 13.5, color: colors.text, flex: 1 },
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
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  billTitle: { fontSize: 13, fontWeight: '700', color: colors.night, marginBottom: spacing.sm },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  billLabel: { fontSize: 13, color: colors.muted },
  billLabelBold: { fontWeight: '700', color: colors.text, fontSize: 14 },
  billValue: { fontSize: 13, color: colors.text },
  billValueBold: { fontWeight: '800', color: colors.paw, fontSize: 15 },
  billDivider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '70%',
    padding: spacing.md,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: colors.night, marginBottom: spacing.sm },
  breedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  breedText: { fontSize: 14.5, color: colors.text },
});
