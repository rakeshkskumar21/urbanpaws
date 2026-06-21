import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { Badge } from './Badge';

interface ServiceCardProps {
  service: Service;
  onPress: (service: Service) => void;
  compact?: boolean;
}

export function ServiceCard({ service, onPress, compact }: ServiceCardProps) {
  return (
    <Pressable
      onPress={() => onPress(service)}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={service.icon} size={26} color={colors.paw} />
      </View>
      <Text style={styles.title}>{service.title}</Text>
      {!compact && (
        <Text style={styles.description} numberOfLines={3}>
          {service.description}
        </Text>
      )}
      <View style={styles.footerRow}>
        <Text style={styles.price}>
          From ₹{service.priceFrom}/{service.priceUnit}
        </Text>
        {service.tag && <Badge label={service.tag} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexBasis: '47%',
    flexGrow: 1,
  },
  cardCompact: {
    flexBasis: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: {
    borderColor: colors.paw,
    opacity: 0.92,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.pawSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.night,
    marginBottom: 4,
  },
  description: {
    fontSize: 12.5,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.paw,
  },
});
