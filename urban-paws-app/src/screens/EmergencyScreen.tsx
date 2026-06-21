import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { generateId } from '@/utils/booking';
import { EmergencyRequest } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Emergency'>;

const REQUEST_TYPES: {
  id: EmergencyRequest['type'];
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  desc: string;
}[] = [
  {
    id: 'medicine_delivery',
    label: 'Medicine delivery',
    icon: 'medkit',
    desc: 'Get prescribed medicine within 2 hours',
  },
  {
    id: 'vet_consult',
    label: 'Vet consultation',
    icon: 'videocam',
    desc: 'Talk to a licensed vet right now',
  },
  {
    id: 'urgent_boarding',
    label: 'Urgent boarding',
    icon: 'home',
    desc: 'Last-minute trip? We will host your pet',
  },
];

export function EmergencyScreen({ navigation }: Props) {
  const { state, dispatch } = useApp();
  const [selectedType, setSelectedType] = useState<EmergencyRequest['type'] | null>(
    null
  );
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const activePet = state.pets.find((p) => p.id === state.selectedPetId);

  const handleSubmit = () => {
    if (!selectedType || !activePet) return;
    const request: EmergencyRequest = {
      id: generateId('sos'),
      type: selectedType,
      petId: activePet.id,
      notes,
      status: 'requested',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_EMERGENCY_REQUEST', request });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successWrap}>
          <Ionicons name="checkmark-circle" size={72} color={colors.sage} />
          <Text style={styles.successTitle}>Help is on the way</Text>
          <Text style={styles.successSub}>
            A specialist has been notified and will reach out within 5 minutes
          </Text>
          <Button
            label="Back to home"
            onPress={() => navigation.popToTop()}
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
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Emergency support</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.callCard}
          onPress={() => Linking.openURL('tel:+918001800729')}
        >
          <View style={styles.callIconWrap}>
            <Ionicons name="call" size={20} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.callTitle}>Call emergency line</Text>
            <Text style={styles.callSub}>1800-PAWS-24 · Available 24/7</Text>
          </View>
        </Pressable>

        <Text style={styles.sectionLabel}>What do you need?</Text>
        <View style={styles.typeList}>
          {REQUEST_TYPES.map((type) => (
            <Pressable
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              style={[
                styles.typeCard,
                selectedType === type.id && styles.typeCardActive,
              ]}
            >
              <View style={styles.typeIconWrap}>
                <Ionicons name={type.icon} size={22} color={colors.paw} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.typeLabel}>{type.label}</Text>
                <Text style={styles.typeDesc}>{type.desc}</Text>
              </View>
              <View style={styles.radioOuter}>
                {selectedType === type.id && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
          Describe the situation
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder={`e.g. ${activePet?.name ?? 'My pet'} has not eaten since morning...`}
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={4}
          style={styles.textarea}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Request emergency help"
          onPress={handleSubmit}
          disabled={!selectedType}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: {
    backgroundColor: '#1A0A05',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.white },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  callCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#CC0000',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  callIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callTitle: { fontSize: 14.5, fontWeight: '700', color: colors.white },
  callSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.paw,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  typeList: { gap: spacing.xs },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  typeCardActive: { borderColor: colors.paw },
  typeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.pawSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: { fontSize: 14, fontWeight: '700', color: colors.night },
  typeDesc: { fontSize: 11.5, color: colors.muted, marginTop: 2 },
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
  textarea: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: colors.text,
  },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  successTitle: { fontSize: 22, fontWeight: '800', color: colors.night, marginTop: spacing.md },
  successSub: { fontSize: 13.5, color: colors.muted, textAlign: 'center', marginTop: 4 },
});
