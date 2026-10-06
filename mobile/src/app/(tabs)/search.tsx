import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { BusinessCard } from '@/components/BusinessCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CityButton } from '@/components/CityButton';
import { colors } from '@/constants/theme';
import { useSettings } from '@/context/SettingsProvider';
import { cityBox } from '@/lib/api';
import { useBusinesses } from '@/lib/useBusinesses';

export default function SearchScreen() {
  const { city, category, setCategory, t } = useSettings();
  const [query, setQuery] = useState('');
  const box = useMemo(() => cityBox(city), [city]);
  const { businesses, loading, error, reload } = useBusinesses(box, category);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return businesses;
    return businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        (b.description ?? '').toLowerCase().includes(q),
    );
  }, [businesses, query]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CityButton />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={t('list.search')}
          placeholderTextColor={colors.muted}
          clearButtonMode="while-editing"
        />
      </View>
      <View>
        <CategoryFilter value={category} onChange={setCategory} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        refreshing={loading && businesses.length > 0}
        onRefresh={reload}
        renderItem={({ item }) => <BusinessCard business={item} onPress={() => router.push(`/business/${item.id}`)} />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.empty} color={colors.primary} />
          ) : (
            <Text style={styles.empty}>{error ? `${t('common.error')}: ${error}` : t('list.empty')}</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 12, paddingTop: 12, gap: 10 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  list: { padding: 12, gap: 10 },
  empty: { marginTop: 40, textAlign: 'center', color: colors.muted },
});
