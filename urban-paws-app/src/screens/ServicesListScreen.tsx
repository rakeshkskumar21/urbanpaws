import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, spacing } from '@/theme';
import { SERVICES } from '@/data/services';
import { ServiceCard } from '@/components/ServiceCard';
import { SectionHeader } from '@/components/SectionHeader';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ServicesListScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          eyebrow="All services"
          title="Everything for your pet"
          subtitle="From daily walks to emergency care — book any service below."
        />
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
