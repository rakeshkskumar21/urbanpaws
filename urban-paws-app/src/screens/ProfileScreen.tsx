import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

interface MenuRow {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export function ProfileScreen({ navigation }: Props) {
  const rows: MenuRow[] = [
    { label: 'Your profile', icon: 'person-outline', onPress: () => {} },
    { label: 'Your orders', icon: 'receipt-outline', onPress: () => navigation.navigate('YourOrders') },
    { label: 'Address book', icon: 'location-outline', onPress: () => navigation.navigate('AddressBook') },
    { label: 'Payments', icon: 'card-outline', onPress: () => {} },
    { label: 'Your pets', icon: 'paw-outline', onPress: () => navigation.navigate('AddPet') },
    { label: 'Send feedback', icon: 'chatbox-ellipses-outline', onPress: () => {} },
    { label: 'Settings', icon: 'settings-outline', onPress: () => {} },
    { label: 'About', icon: 'information-circle-outline', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>R</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Rahul Sharma</Text>
            <Text style={styles.profilePhone}>+91 98765 43210</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {rows.map((row, i) => (
            <Pressable
              key={row.label}
              style={[styles.menuRow, i === rows.length - 1 && { borderBottomWidth: 0 }]}
              onPress={row.onPress}
            >
              <Ionicons name={row.icon} size={20} color={colors.text} />
              <Text style={styles.menuLabel}>{row.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.logoutRow}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutLabel}>Log out</Text>
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
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.pawSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: colors.pawDeep },
  profileName: { fontSize: 16, fontWeight: '700', color: colors.night },
  profilePhone: { fontSize: 13, color: colors.muted, marginTop: 2 },
  menuCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: { fontSize: 14, color: colors.text, flex: 1 },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    justifyContent: 'center',
    padding: spacing.md,
  },
  logoutLabel: { fontSize: 14, fontWeight: '700', color: colors.danger },
});
