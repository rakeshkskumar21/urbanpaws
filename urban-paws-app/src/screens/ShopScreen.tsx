import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { SHOP_PRODUCTS } from '@/data/shop';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/booking';

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  shampoo: 'water',
  soap: 'sparkles',
  brush: 'brush',
  bowl: 'restaurant',
  tag: 'pricetag',
  leash: 'link',
  shoes: 'footsteps',
  balm: 'medical',
};

export function ShopScreen({ navigation }: Props) {
  const { dispatch, cartCount, cartTotal } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Pet Supplies</Text>
        <Pressable onPress={() => navigation.navigate('Cart')} style={styles.backBtn}>
          <Ionicons name="bag-handle-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heroText}>
          Quality grooming products and essentials, shipped same day.
        </Text>

        <View style={styles.grid}>
          {SHOP_PRODUCTS.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productIconWrap}>
                <Ionicons
                  name={ICON_MAP[product.icon] ?? 'cube'}
                  size={26}
                  color={colors.paw}
                />
              </View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDesc}>{product.description}</Text>
              <View style={styles.productFooter}>
                <Text style={styles.productPrice}>
                  {formatCurrency(product.price)}
                </Text>
                <Pressable
                  style={styles.addBtn}
                  onPress={() =>
                    dispatch({
                      type: 'ADD_TO_CART',
                      item: {
                        id: `cart-${product.id}`,
                        refId: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        kind: 'shop_product',
                      },
                    })
                  }
                >
                  <Ionicons name="add" size={16} color={colors.white} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {cartCount > 0 && (
        <Pressable style={styles.cartBar} onPress={() => navigation.navigate('Cart')}>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  productCard: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  productIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.pawSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  productName: { fontSize: 13.5, fontWeight: '700', color: colors.night, marginBottom: 2 },
  productDesc: { fontSize: 11.5, color: colors.muted, lineHeight: 16, marginBottom: spacing.sm },
  productFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  productPrice: { fontSize: 13.5, fontWeight: '700', color: colors.paw },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.paw,
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
