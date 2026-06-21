import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing, shadow } from '@/theme';
import { SERVICES } from '@/data/services';
import { ServiceCard } from '@/components/ServiceCard';
import { SectionHeader } from '@/components/SectionHeader';
import { useApp } from '@/context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { state } = useApp();
  const activePet = state.pets.find((p) => p.id === state.selectedPetId);
  const defaultAddress = state.addresses.find((a) => a.isDefault) ?? state.addresses[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            style={styles.locationRow}
            onPress={() => navigation.navigate('Location')}
          >
            <Ionicons name="location" size={18} color={colors.paw} />
            <Text style={styles.locationText} numberOfLines={1}>
              {defaultAddress ? defaultAddress.label : 'Set location'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.muted} />
          </Pressable>
          <View style={styles.headerIcons}>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
            </Pressable>
            <Pressable
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle-outline" size={22} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.emergencyBanner}
          onPress={() => navigation.navigate('Emergency')}
        >
          <View style={styles.sosBadge}>
            <Text style={styles.sosText}>SOS</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>24/7 Pet Emergency</Text>
            <Text style={styles.emergencySub}>
              Medicine delivery & urgent vet help, always on call
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.white} />
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.greeting}>
            {activePet ? `Hey ${activePet.name}'s parent 👋` : 'Welcome to Urban Paws'}
          </Text>
          <Text style={styles.greetingSub}>
            What does your pet need today?
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.grid}>
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() =>
                  navigation.navigate('ServiceDetail', { serviceId: service.id })
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            eyebrow="Live now"
            title="Today's activity"
          />
          <View style={styles.activityCard}>
            <View style={styles.activityIconWrap}>
              <Ionicons name="walk" size={22} color={colors.paw} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>No active bookings yet</Text>
              <Text style={styles.activitySub}>
                Book a walk or meal to see live tracking here
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { paddingBottom: spacing.xxl }]}>
          <SectionHeader eyebrow="Quick access" title="Shop & feed" />
          <View style={styles.quickRow}>
            <Pressable
              style={styles.quickCard}
              onPress={() => navigation.navigate('FoodMenu')}
            >
              <Text style={styles.quickEmoji}>🍲</Text>
              <Text style={styles.quickLabel}>Order fresh food</Text>
            </Pressable>
            <Pressable
              style={styles.quickCard}
              onPress={() => navigation.navigate('Shop')}
            >
              <Text style={styles.quickEmoji}>🛒</Text>
              <Text style={styles.quickLabel}>Pet supplies</Text>
            </Pressable>
          </View>
        </View>
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.night,
    maxWidth: 160,
  },
  headerIcons: { flexDirection: 'row', gap: spacing.xs },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyBanner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: '#1A0A05',
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sosBadge: {
    backgroundColor: '#CC0000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  sosText: { color: colors.white, fontWeight: '800', fontSize: 12 },
  emergencyTitle: { color: colors.white, fontWeight: '700', fontSize: 14 },
  emergencySub: { color: 'rgba(255,255,255,0.6)', fontSize: 11.5, marginTop: 2 },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.night },
  greetingSub: { fontSize: 13, color: colors.muted, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.pawSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: { fontSize: 14, fontWeight: '700', color: colors.night },
  activitySub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quickCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickEmoji: { fontSize: 28 },
  quickLabel: { fontSize: 12.5, fontWeight: '700', color: colors.night },
});
