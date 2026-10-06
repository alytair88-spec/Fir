import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { type Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BusinessMarker } from '@/components/BusinessMarker';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CityButton } from '@/components/CityButton';
import type { City } from '@/constants/cities';
import { colors } from '@/constants/theme';
import { useSettings } from '@/context/SettingsProvider';
import type { BoundingBox } from '@/lib/types';
import { useBusinesses } from '@/lib/useBusinesses';

function cityRegion(city: City): Region {
  return { latitude: city.latitude, longitude: city.longitude, latitudeDelta: city.span, longitudeDelta: city.span };
}

function regionBox(region: Region): BoundingBox {
  return {
    minLat: region.latitude - region.latitudeDelta / 2,
    maxLat: region.latitude + region.latitudeDelta / 2,
    minLng: region.longitude - region.longitudeDelta / 2,
    maxLng: region.longitude + region.longitudeDelta / 2,
  };
}

export default function MapScreen() {
  const { city, category, setCategory, t } = useSettings();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(() => cityRegion(city));
  const [locationGranted, setLocationGranted] = useState(false);
  const [shownCity, setShownCity] = useState(city);

  // Another city was selected: query its area right away instead of waiting for the animation.
  if (shownCity !== city) {
    setShownCity(city);
    setRegion(cityRegion(city));
  }

  useEffect(() => {
    mapRef.current?.animateToRegion(cityRegion(city), 600);
  }, [city]);

  const box = useMemo(() => regionBox(region), [region]);
  const { businesses, loading, error, reload } = useBusinesses(box, category);

  async function goToMyLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    setLocationGranted(true);
    const position = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion(
      { latitude: position.coords.latitude, longitude: position.coords.longitude, latitudeDelta: 0.03, longitudeDelta: 0.03 },
      600,
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={locationGranted}
        showsPointsOfInterests={false}
        toolbarEnabled={false}
      >
        {businesses.map((b) => (
          <BusinessMarker key={b.id} business={b} onPress={(item) => router.push(`/business/${item.id}`)} />
        ))}
      </MapView>

      <SafeAreaView edges={['top']} style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topRow} pointerEvents="box-none">
          <CityButton />
          <View style={styles.counter}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.counterText}>{t('map.objects', { n: businesses.length })}</Text>
            )}
          </View>
        </View>
        <CategoryFilter value={category} onChange={setCategory} />
        {error ? (
          <Pressable style={styles.error} onPress={reload}>
            <Text style={styles.errorText}>
              {t('common.error')}: {error} · {t('common.retry')}
            </Text>
          </Pressable>
        ) : null}
      </SafeAreaView>

      <Pressable style={styles.locate} onPress={goToMyLocation} accessibilityRole="button">
        <Text style={styles.locateText}>◎</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  counter: {
    minWidth: 44,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  counterText: { fontSize: 13, color: colors.muted },
  error: { marginHorizontal: 12, padding: 10, borderRadius: 10, backgroundColor: colors.warningBg },
  errorText: { color: colors.warningText },
  locate: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  locateText: { fontSize: 24, color: colors.primary },
});
