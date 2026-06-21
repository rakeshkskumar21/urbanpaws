import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { SERVICES } from '@/data/services';
import { Button } from '@/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceDetail'>;

const FEATURES_BY_CATEGORY: Record<string, string[]> = {
  walking: ['Paw cleaning after walk', 'Live GPS tracking', 'Routes are recorded'],
  feeding: ['No preservatives', 'Cooked fresh daily', 'Veg & non-veg options'],
  grooming: ['Bath & blow dry', 'Nail clipping', 'Ear cleaning'],
  boarding: ['Verified host families', 'Daily photo updates', 'Dog & cat friendly'],
  vaccination: ['At-home vet visit', '2-hour medicine delivery', 'Digital health record'],
  taxi: ['AC Maruti Omni', 'No ride rejections', 'Pet-safe restraints'],
  insurance: ['Accident cover', 'Illness & surgery cover', '5-minute enrollment'],
  sitting: ['In-home visits', 'No displacement stress', 'Flexible scheduling'],
};

export function ServiceDetailScreen({ route, navigation }: Props) {
  const { serviceId } = route.params;
  const service = SERVICES.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text>Service not found</Text>
      </SafeAreaView>
    );
  }

  const features = FEATURES_BY_CATEGORY[service.category] ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{service.title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroIconWrap}>
          <Ionicons name={service.icon} size={48} color={colors.paw} />
        </View>

        <Text style={styles.description}>{service.description}</Text>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Key features</Text>
          {features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={18} color={colors.sage} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Starting price</Text>
          <Text style={styles.priceValue}>
            ₹{service.priceFrom}/{service.priceUnit}
          </Text>
          <Text style={styles.priceNote}>
            Final price includes platform fee (₹1) and partner fee (₹2/km)
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue to booking →"
          onPress={() => navigation.navigate('BookingFlow', { serviceId: service.id })}
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
  heroIconWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.lg,
    backgroundColor: colors.pawSoft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14.5,
    color: colors.muted,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  featuresCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  featuresTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.night,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 6,
  },
  featureText: { fontSize: 14, color: colors.text },
  priceCard: {
    backgroundColor: colors.night,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  priceLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  priceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginVertical: 4,
  },
  priceNote: { fontSize: 11.5, color: 'rgba(255,255,255,0.5)', lineHeight: 16 },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
});
