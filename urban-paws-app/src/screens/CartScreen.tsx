import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/booking';
import { Button } from '@/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const { state, dispatch, cartTotal } = useApp();

  const deliveryFee = state.cart.length > 0 ? 25 : 0;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Your cart</Text>
        <View style={{ width: 36 }} />
      </View>

      {state.cart.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bag-handle-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>
            Add fresh food or pet supplies to get started
          </Text>
          <Button
            label="Browse food menu"
            onPress={() => navigation.navigate('FoodMenu')}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            {state.cart.map((item) => (
              <View key={item.id} style={styles.cartRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>
                    {formatCurrency(item.price)} each
                  </Text>
                </View>
                <View style={styles.qtyControl}>
                  <Pressable
                    style={styles.qtyBtn}
                    onPress={() =>
                      dispatch({
                        type: 'UPDATE_CART_QTY',
                        itemId: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                  >
                    <Ionicons name="remove" size={16} color={colors.text} />
                  </Pressable>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <Pressable
                    style={styles.qtyBtn}
                    onPress={() =>
                      dispatch({
                        type: 'UPDATE_CART_QTY',
                        itemId: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    <Ionicons name="add" size={16} color={colors.text} />
                  </Pressable>
                </View>
              </View>
            ))}

            <View style={styles.billCard}>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Subtotal</Text>
                <Text style={styles.billValue}>{formatCurrency(cartTotal)}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery fee</Text>
                <Text style={styles.billValue}>{formatCurrency(deliveryFee)}</Text>
              </View>
              <View style={styles.billDivider} />
              <View style={styles.billRow}>
                <Text style={styles.billLabelBold}>Grand total</Text>
                <Text style={styles.billValueBold}>{formatCurrency(grandTotal)}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label={`Checkout · ${formatCurrency(grandTotal)}`}
              onPress={() => navigation.navigate('Checkout')}
              style={{ width: '100%' }}
            />
          </View>
        </>
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
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.night, marginTop: spacing.md },
  emptySub: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 4 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  cartItemName: { fontSize: 14, fontWeight: '700', color: colors.night },
  cartItemPrice: { fontSize: 12, color: colors.muted, marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.pawSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: { fontSize: 14, fontWeight: '700', color: colors.text, minWidth: 18, textAlign: 'center' },
  billCard: {
    marginTop: spacing.md,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  billLabel: { fontSize: 13, color: colors.muted },
  billValue: { fontSize: 13, color: colors.text, fontWeight: '500' },
  billLabelBold: { fontSize: 14, fontWeight: '700', color: colors.text },
  billValueBold: { fontSize: 16, fontWeight: '800', color: colors.paw },
  billDivider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
