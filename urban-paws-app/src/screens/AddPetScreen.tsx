import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { BREEDS } from '@/data/shop';
import { generateId } from '@/utils/booking';
import { AgeGroup, PetGender } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPet'>;

const AGE_OPTIONS: { id: AgeGroup; label: string }[] = [
  { id: 'under_6_months', label: 'Under 6 months' },
  { id: '6_12_months', label: '6–12 months' },
  { id: '1_3_years', label: '1–3 years' },
  { id: '3_7_years', label: '3–7 years' },
  { id: '7_plus_years', label: '7+ years' },
];

export function AddPetScreen({ navigation }: Props) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState(BREEDS[0]);
  const [age, setAge] = useState<AgeGroup>('1_3_years');
  const [gender, setGender] = useState<PetGender>('male');

  const isValid = name.trim().length > 0;

  const handleSave = () => {
    dispatch({
      type: 'ADD_PET',
      pet: {
        id: generateId('pet'),
        name: name.trim(),
        breed,
        ageGroup: age,
        gender,
        species: 'dog',
      },
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add a pet</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.fieldLabel}>Pet name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Bruno"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>Breed</Text>
        <View style={styles.chipWrap}>
          {BREEDS.map((b) => (
            <Pressable
              key={b}
              onPress={() => setBreed(b)}
              style={[styles.chip, breed === b && styles.chipActive]}
            >
              <Text style={[styles.chipText, breed === b && styles.chipTextActive]}>
                {b}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Age</Text>
        <View style={styles.chipWrap}>
          {AGE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => setAge(opt.id)}
              style={[styles.chip, age === opt.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, age === opt.id && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Gender</Text>
        <View style={styles.chipWrap}>
          {(['male', 'female'] as PetGender[]).map((g) => (
            <Pressable
              key={g}
              onPress={() => setGender(g)}
              style={[styles.chip, gender === g && styles.chipActive]}
            >
              <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>
                {g === 'male' ? 'Male' : 'Female'}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Save pet"
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
