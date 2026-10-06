import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { getCategory } from '@/constants/categories';
import { colors } from '@/constants/theme';
import { useSettings } from '@/context/SettingsProvider';
import { fetchBusiness } from '@/lib/api';
import type { Business } from '@/lib/types';

function directionsUrl(b: Business): string {
  const label = encodeURIComponent(b.name);
  return Platform.OS === 'ios'
    ? `http://maps.apple.com/?daddr=${b.latitude},${b.longitude}&q=${label}`
    : `geo:0,0?q=${b.latitude},${b.longitude}(${label})`;
}

function websiteUrl(site: string): string {
  return /^https?:\/\//i.test(site) ? site : `https://${site}`;
}

export default function BusinessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lang, t } = useSettings();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchBusiness(id)
      .then((b) => !cancelled && setBusiness(b))
      .catch(() => !cancelled && setBusiness(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={styles.center} color={colors.primary} />;
  }
  if (!business) {
    return <Text style={styles.center}>{t('details.notFound')}</Text>;
  }

  const category = getCategory(business.category);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: business.name }} />

      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: category.color }]}>
          <Text style={styles.emoji}>{category.emoji}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{business.name}</Text>
          <Text style={styles.category}>{category.name[lang]}</Text>
        </View>
      </View>

      {business.description ? <Text style={styles.description}>{business.description}</Text> : null}

      <View style={styles.actions}>
        {business.phone ? (
          <ActionButton label={`📞 ${t('details.call')}`} onPress={() => Linking.openURL(`tel:${business.phone}`)} />
        ) : null}
        <ActionButton label={`🧭 ${t('details.route')}`} onPress={() => Linking.openURL(directionsUrl(business))} />
      </View>

      <View style={styles.card}>
        <Row label={t('details.address')} value={`${business.address}`} />
        {business.opening_hours ? <Row label={t('details.hours')} value={business.opening_hours} /> : null}
        {business.phone ? (
          <Row label={t('details.phone')} value={business.phone} onPress={() => Linking.openURL(`tel:${business.phone}`)} />
        ) : null}
        {business.email ? (
          <Row label={t('details.email')} value={business.email} onPress={() => Linking.openURL(`mailto:${business.email}`)} />
        ) : null}
        {business.website ? (
          <Row label={t('details.website')} value={business.website} onPress={() => Linking.openURL(websiteUrl(business.website!))} />
        ) : null}
      </View>

      <MapView
        style={styles.map}
        initialRegion={{ latitude: business.latitude, longitude: business.longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Marker coordinate={{ latitude: business.latitude, longitude: business.longitude }} pinColor={category.color} />
      </MapView>
    </ScrollView>
  );
}

function ActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]} onPress={onPress}>
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

function Row({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, onPress && styles.link]}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { marginTop: 60, textAlign: 'center', color: colors.muted },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 28 },
  headerText: { flex: 1 },
  name: { fontSize: 22, fontWeight: '700', color: colors.text },
  category: { fontSize: 15, color: colors.muted, marginTop: 2 },
  description: { fontSize: 15, lineHeight: 21, color: colors.text },
  actions: { flexDirection: 'row', gap: 10 },
  action: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center' },
  actionText: { color: colors.primaryText, fontSize: 15, fontWeight: '600' },
  card: { backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14 },
  row: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, gap: 2 },
  rowLabel: { fontSize: 12, color: colors.muted },
  rowValue: { fontSize: 15, color: colors.text },
  link: { color: colors.primary },
  map: { height: 200, borderRadius: 12 },
});
