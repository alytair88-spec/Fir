import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';

import { POPULAR_CITIES, type City } from '@/constants/cities';
import { colors } from '@/constants/theme';
import { useSettings } from '@/context/SettingsProvider';
import { searchCities } from '@/lib/geocode';

// Accent-insensitive match so "gyor" finds "Győr".
function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function CityPickerScreen() {
  const { city: current, setCity, lang, t } = useSettings();
  const [query, setQuery] = useState('');
  // Geocoding results tagged with the query they answer, so stale ones are never shown.
  const [remote, setRemote] = useState<{ query: string; cities: City[] }>({ query: '', cities: [] });

  const trimmed = query.trim();
  const shouldSearch = trimmed.length >= 2;
  const searching = shouldSearch && remote.query !== trimmed;

  const popular = useMemo(() => {
    const q = normalize(trimmed);
    return q ? POPULAR_CITIES.filter((c) => normalize(c.name).includes(q)) : POPULAR_CITIES;
  }, [trimmed]);

  // Debounced lookup of any settlement in Hungary (Nominatim allows ~1 request/second).
  useEffect(() => {
    if (!shouldSearch) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      searchCities(trimmed, lang)
        .catch(() => [] as City[])
        .then((cities) => {
          if (!cancelled) setRemote({ query: trimmed, cities });
        });
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [shouldSearch, trimmed, lang]);

  const remoteCities = useMemo(() => {
    if (!shouldSearch || remote.query !== trimmed) return [];
    const known = new Set(popular.map((c) => normalize(c.name)));
    return remote.cities.filter((c) => !known.has(normalize(c.name)));
  }, [shouldSearch, remote, trimmed, popular]);

  function choose(city: City) {
    setCity(city);
    router.back();
  }

  const sections = [
    { title: t('city.popular'), data: popular },
    ...(remoteCities.length > 0 ? [{ title: t('city.results'), data: remoteCities }] : []),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={t('city.search')}
          placeholderTextColor={colors.muted}
          autoFocus
          autoCorrect={false}
        />
        {searching ? <ActivityIndicator color={colors.primary} /> : null}
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(c) => `${c.name}-${c.latitude}-${c.longitude}`}
        keyboardShouldPersistTaps="handled"
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
        renderItem={({ item }) => (
          <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]} onPress={() => choose(item)}>
            <Text style={[styles.rowText, item.name === current.name && styles.current]}>{item.name}</Text>
            {item.name === current.name ? <Text style={styles.current}>✓</Text> : null}
          </Pressable>
        )}
        ListFooterComponent={
          shouldSearch && !searching && popular.length === 0 && remoteCities.length === 0 ? (
            <Text style={styles.nothing}>{t('city.nothing')}</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    backgroundColor: colors.background,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: { opacity: 0.6 },
  rowText: { fontSize: 16, color: colors.text },
  current: { color: colors.primary, fontWeight: '600' },
  nothing: { textAlign: 'center', marginTop: 24, color: colors.muted },
});
