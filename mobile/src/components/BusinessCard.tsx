import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getCategory } from '@/constants/categories';
import { colors } from '@/constants/theme';
import { useSettings } from '@/context/SettingsProvider';
import type { Business } from '@/lib/types';

interface Props {
  business: Business;
  onPress: () => void;
  badge?: string;
}

export function BusinessCard({ business, onPress, badge }: Props) {
  const { lang } = useSettings();
  const category = getCategory(business.category);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.icon, { backgroundColor: category.color }]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {business.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {category.name[lang]} · {business.address}
        </Text>
        {business.opening_hours ? (
          <Text style={styles.meta} numberOfLines={1}>
            🕒 {business.opening_hours}
          </Text>
        ) : null}
      </View>
      {badge ? <Text style={styles.badge}>{badge}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.7 },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  body: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  meta: { fontSize: 13, color: colors.muted },
  badge: {
    fontSize: 12,
    color: colors.warningText,
    backgroundColor: colors.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
