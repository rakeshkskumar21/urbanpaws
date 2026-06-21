import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { useApp } from '@/context/AppContext';
import { CITIES } from '@/data/shop';

type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

export function LocationScreen({ navigation }: Props) {
  const { state } = useApp();
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Select a location</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search for area, street name..."
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
        />
      </View>

      <Pressable style={styles.deviceLocCard}>
        <Ionicons name="navigate-circle-outline" size={22} color={colors.danger} />
        <View style={{ flex: 1 }}>
          <Text style={styles.deviceLocTitle}>Device location not enabled</Text>
          <Text style={styles.deviceLocSub}>Tap to enable for a better experience</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.muted} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Saved addresses</Text>
        {state.addresses.map((addr) => (
          <View key={addr.id} style={styles.addressRow}>
            <Ionicons name="home" size={18} color={colors.paw} />
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>{addr.label}</Text>
              <Text style={styles.addressLine}>
                {addr.line}, {addr.city}
              </Text>
            </View>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="checkmark-circle" size={20} color={colors.sage} />
            </Pressable>
          </View>
        ))}

        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
          Operating cities
        </Text>
        <View style={styles.cityGrid}>
          {CITIES.map((city) => (
            <View key={city} style={styles.cityChip}>
              <Text style={styles.cityChipText}>{city}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.addAddressBtn}
          onPress={() => navigation.navigate('AddAddress')}
        >
          <Ionicons name="add-circle-outline" size={18} color={colors.paw} />
          <Text style={styles.addAddressText}>Add new address</Text>
        </Pressable>
      </ScrollView>
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.md,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: colors.text },
  deviceLocCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  deviceLocTitle: { fontSize: 13, fontWeight: '700', color: colors.danger },
  deviceLocSub: { fontSize: 11.5, color: colors.danger, opacity: 0.8, marginTop: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.paw,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
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
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  cityChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cityChipText: { fontSize: 12, color: colors.muted, fontWeight: '500' },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.paw,
    borderRadius: radius.md,
  },
  addAddressText: { fontSize: 13.5, fontWeight: '700', color: colors.paw },
});
