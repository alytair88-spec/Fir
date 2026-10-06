import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { CATEGORIES, type CategorySlug } from '@/constants/categories';
import { colors } from '@/constants/theme';
import { useSettings } from '@/context/SettingsProvider';

interface Props {
  value: CategorySlug | null;
  onChange: (value: CategorySlug | null) => void;
}

/** Horizontal chips: "All" plus every category. */
export function CategoryFilter({ value, onChange }: Props) {
  const { lang, t } = useSettings();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Chip label={t('common.all')} active={value === null} onPress={() => onChange(null)} />
      {CATEGORIES.map((c) => (
        <Chip
          key={c.slug}
          label={`${c.emoji} ${c.name[lang]}`}
          active={value === c.slug}
          color={c.color}
          onPress={() => onChange(value === c.slug ? null : c.slug)}
        />
      ))}
    </ScrollView>
  );
}

function Chip({ label, active, color = colors.primary, onPress }: { label: string; active: boolean; color?: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipText: { fontSize: 14, color: colors.text },
  chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
});
