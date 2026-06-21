import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { MENU_ITEMS, ADD_ONS } from '@/data/menu';
import { Badge } from '@/components/Badge';
import { useApp } from '@/context/AppContext';
import { DietType } from '@/types';
import { formatCurrency } from '@/utils/booking';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodMenu'>;

type FilterValue = DietType | 'all';

export function FoodMenuScreen({ navigation }: Props) {
  const { dispatch, cartCount, cartTotal } = useApp();
  const [filter, setFilter] = useState<FilterValue>('all');

  const filteredItems = useMemo(
    () => MENU_ITEMS.filter((item) => filter === 'all' || item.diet === filter),
    [filter]
  );

  const handleAdd = (itemId: string) => {
    const item = MENU_ITEMS.find((m) => m.id === itemId);
    if (!item) return;
    dispatch({
      type: 'ADD_TO_CART',
      item: {
        id: `cart-${item.id}`,
        refId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        kind: 'menu_item',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Pet Feeding</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heroText}>
          Fresh-cooked meals, no preservatives. Delivered in 30–35 min.
        </Text>

        <View style={styles.filterRow}>
          <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip
            label="🌿 Veg"
            active={filter === 'veg'}
            onPress={() => setFilter('veg')}
          />
          <FilterChip
            label="🥩 Non-veg"
            active={filter === 'non_veg'}
            onPress={() => setFilter('non_veg')}
          />
        </View>

        <View style={styles.menuList}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.menuCard}>
              <View style={styles.menuIconWrap}>
                <Text style={styles.menuEmoji}>
                  {item.diet === 'veg' ? '🍚' : '🍗'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.menuTitleRow}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Badge
                    label={item.diet === 'veg' ? 'Veg' : 'Non-veg'}
                    variant={item.diet === 'veg' ? 'success' : 'danger'}
                  />
                </View>
                <Text style={styles.menuDesc}>{item.description}</Text>
                <Text style={styles.menuWeight}>Approx. {item.weightApprox}</Text>
                <View style={styles.menuFooter}>
                  <Text style={styles.menuPrice}>
                    {formatCurrency(item.price)}/bowl
                  </Text>
                  <Pressable
                    style={styles.addBtn}
                    onPress={() => handleAdd(item.id)}
                  >
                    <Text style={styles.addBtnText}>Add</Text>
                    <Ionicons name="add" size={14} color={colors.white} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.addOnCard}>
          <Text style={styles.addOnTitle}>Customizable add-ons</Text>
          {ADD_ONS.map((addOn) => (
            <View key={addOn.id} style={styles.addOnRow}>
              <Text style={styles.addOnName}>{addOn.name}</Text>
              <View style={styles.addOnRight}>
                <Text style={styles.addOnPrice}>{formatCurrency(addOn.price)}</Text>
                <Pressable
                  onPress={() =>
                    dispatch({
                      type: 'ADD_TO_CART',
                      item: {
                        id: `cart-${addOn.id}`,
                        refId: addOn.id,
                        name: addOn.name,
                        price: addOn.price,
                        quantity: 1,
                        kind: 'add_on',
                      },
                    })
                  }
                  style={styles.addOnAddBtn}
                >
                  <Ionicons name="add" size={16} color={colors.paw} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {cartCount > 0 && (
        <Pressable
          style={styles.cartBar}
          onPress={() => navigation.navigate('Cart')}
        >
          <View style={styles.cartBarLeft}>
            <Ionicons name="bag-handle" size={18} color={colors.white} />
            <Text style={styles.cartBarText}>
              {cartCount} item{cartCount > 1 ? 's' : ''} · {formatCurrency(cartTotal)}
            </Text>
          </View>
          <Text style={styles.cartBarCta}>View cart →</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
        {label}
      </Text>
    </Pressable>
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
  heroText: { fontSize: 13.5, color: colors.muted, marginBottom: spacing.md, lineHeight: 20 },
  filterRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
  },
  filterChipActive: { backgroundColor: colors.paw, borderColor: colors.paw },
  filterChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  filterChipTextActive: { color: colors.white },
  menuList: { gap: spacing.sm },
  menuCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  menuIconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.pawSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuEmoji: { fontSize: 24 },
  menuTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 2 },
  menuName: { fontSize: 14.5, fontWeight: '700', color: colors.night },
  menuDesc: { fontSize: 12, color: colors.muted, lineHeight: 17 },
  menuWeight: { fontSize: 11, color: colors.warmGray, marginTop: 2 },
  menuFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  menuPrice: { fontSize: 13.5, fontWeight: '700', color: colors.paw },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.paw,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  addBtnText: { fontSize: 12, fontWeight: '700', color: colors.white },
  addOnCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  addOnTitle: { fontSize: 13, fontWeight: '700', color: colors.night, marginBottom: spacing.sm },
  addOnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addOnName: { fontSize: 13, color: colors.text, flex: 1 },
  addOnRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  addOnPrice: { fontSize: 13, fontWeight: '600', color: colors.muted },
  addOnAddBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.pawSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBar: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.night,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  cartBarText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  cartBarCta: { color: colors.paw, fontWeight: '700', fontSize: 13 },
});
