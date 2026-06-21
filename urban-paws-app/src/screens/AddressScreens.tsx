import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/Button';
import { generateId } from '@/utils/booking';
import { CITIES } from '@/data/shop';

type AddressBookProps = NativeStackScreenProps<RootStackParamList, 'AddressBook'>;
type AddAddressProps = NativeStackScreenProps<RootStackParamList, 'AddAddress'>;

export function AddressBookScreen({ navigation }: AddressBookProps) {
  const { state } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Address book</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {state.addresses.map((addr) => (
          <View key={addr.id} style={styles.addressRow}>
            <Ionicons name="home" size={18} color={colors.paw} />
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>{addr.label}</Text>
              <Text style={styles.addressLine}>
                {addr.line}, {addr.city}
              </Text>
            </View>
            <Pressable>
              <Ionicons name="ellipsis-vertical" size={18} color={colors.muted} />
            </Pressable>
          </View>
        ))}

        <Pressable
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddAddress')}
        >
          <Ionicons name="add-circle-outline" size={18} color={colors.paw} />
          <Text style={styles.addBtnText}>Add new address</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export function AddAddressScreen({ navigation }: AddAddressProps) {
  const { dispatch } = useApp();
  const [label, setLabel] = useState('');
  const [line, setLine] = useState('');
  const [city, setCity] = useState(CITIES[0]);

  const isValid = label.trim().length > 0 && line.trim().length > 0;

  const handleSave = () => {
    dispatch({
      type: 'ADD_ADDRESS',
      address: { id: generateId('addr'), label: label.trim(), line: line.trim(), city },
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add address</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.fieldLabel}>Label</Text>
        <TextInput
          value={label}
          onChangeText={setLabel}
          placeholder="e.g. Home, Office"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>Full address</Text>
        <TextInput
          value={line}
          onChangeText={setLine}
          placeholder="Flat / Tower / Apartment, Area"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <Text style={styles.fieldLabel}>City</Text>
        <View style={styles.chipWrap}>
          {CITIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCity(c)}
              style={[styles.chip, city === c && styles.chipActive]}
            >
              <Text style={[styles.chipText, city === c && styles.chipTextActive]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Save address"
          onPress={handleSave}
          disabled={!isValid}
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
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  addressLabel: { fontSize: 14, fontWeight: '700', color: colors.night },
  addressLine: { fontSize: 12, color: colors.muted, marginTop: 2 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.paw,
    borderRadius: radius.md,
  },
  addBtnText: { fontSize: 13.5, fontWeight: '700', color: colors.paw },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
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
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
  },
  chipActive: { backgroundColor: colors.paw, borderColor: colors.paw },
  chipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  chipTextActive: { color: colors.white },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
