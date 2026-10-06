import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import MapView, { Marker, type LatLng } from 'react-native-maps';

import { CATEGORIES, type CategorySlug } from '@/constants/categories';
import { isInHungary } from '@/constants/cities';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useSettings } from '@/context/SettingsProvider';
import { createBusiness, deleteBusiness, fetchBusiness, updateBusiness } from '@/lib/api';
import { geocodeAddress } from '@/lib/geocode';
import type { BusinessInput } from '@/lib/types';

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export default function EditBusinessScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { session } = useAuth();
  const { city: selectedCity, lang, t } = useSettings();
  const mapRef = useRef<MapView>(null);

  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategorySlug | null>(null);
  const [description, setDescription] = useState('');
  const [city, setCity] = useState(selectedCity.name);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<LatLng | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [hours, setHours] = useState('');
  const [published, setPublished] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchBusiness(id)
      .then((b) => {
        if (!b) return;
        setName(b.name);
        setCategory(b.category);
        setDescription(b.description ?? '');
        setCity(b.city);
        setAddress(b.address);
        setLocation({ latitude: b.latitude, longitude: b.longitude });
        setPhone(b.phone ?? '');
        setEmail(b.email ?? '');
        setWebsite(b.website ?? '');
        setHours(b.opening_hours ?? '');
        setPublished(b.is_published);
        mapRef.current?.animateToRegion({ latitude: b.latitude, longitude: b.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      })
      .catch((e) => Alert.alert(t('common.error'), String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }, [id, t]);

  function pickLocation(coordinate: LatLng) {
    if (!isInHungary(coordinate.latitude, coordinate.longitude)) {
      Alert.alert(t('common.error'), t('form.outsideHungary'));
      return;
    }
    setLocation(coordinate);
  }

  async function findAddress() {
    if (!address.trim() || !city.trim()) return;
    const found = await geocodeAddress(address.trim(), city.trim()).catch(() => null);
    if (!found) {
      Alert.alert(t('common.error'), t('form.addressNotFound'));
      return;
    }
    pickLocation(found);
    mapRef.current?.animateToRegion({ ...found, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500);
  }

  async function save() {
    if (!session) return;
    if (name.trim().length < 2 || !category || !city.trim() || address.trim().length < 3 || !location) {
      Alert.alert(t('common.error'), t('form.required'));
      return;
    }
    const input: BusinessInput = {
      name: name.trim(),
      category,
      description: emptyToNull(description),
      city: city.trim(),
      address: address.trim(),
      latitude: location.latitude,
      longitude: location.longitude,
      phone: emptyToNull(phone),
      email: emptyToNull(email),
      website: emptyToNull(website),
      opening_hours: emptyToNull(hours),
      is_published: published,
    };
    setSaving(true);
    try {
      if (id) {
        await updateBusiness(id, input);
      } else {
        await createBusiness(session.user.id, input);
      }
      router.back();
    } catch (e) {
      Alert.alert(t('common.error'), e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!id) return;
    Alert.alert(t('common.delete'), t('form.confirmDelete'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBusiness(id);
            router.back();
          } catch (e) {
            Alert.alert(t('common.error'), e instanceof Error ? e.message : String(e));
          }
        },
      },
    ]);
  }

  if (!session) {
    return <Text style={styles.center}>{t('auth.subtitle')}</Text>;
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: id ? t('form.editTitle') : t('form.newTitle') }} />
      {loading ? (
        <ActivityIndicator style={styles.center} color={colors.primary} />
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Field label={t('form.name')} value={name} onChangeText={setName} maxLength={120} />

          <Text style={styles.label}>{t('form.category')}</Text>
          <View style={styles.categories}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.slug}
                onPress={() => setCategory(c.slug)}
                style={[styles.chip, category === c.slug && { backgroundColor: c.color, borderColor: c.color }]}
              >
                <Text style={[styles.chipText, category === c.slug && styles.chipTextActive]}>
                  {c.emoji} {c.name[lang]}
                </Text>
              </Pressable>
            ))}
          </View>

          <Field label={t('form.description')} value={description} onChangeText={setDescription} multiline maxLength={2000} />
          <Field label={t('form.city')} value={city} onChangeText={setCity} maxLength={80} />
          <Field label={t('form.address')} value={address} onChangeText={setAddress} maxLength={200} />
          <Pressable style={styles.secondary} onPress={findAddress}>
            <Text style={styles.secondaryText}>🔍 {t('form.findAddress')}</Text>
          </Pressable>

          <Text style={styles.label}>{t('form.location')}</Text>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude ?? selectedCity.latitude,
              longitude: location?.longitude ?? selectedCity.longitude,
              latitudeDelta: location ? 0.01 : selectedCity.span,
              longitudeDelta: location ? 0.01 : selectedCity.span,
            }}
            onPress={(e) => pickLocation(e.nativeEvent.coordinate)}
          >
            {location ? (
              <Marker coordinate={location} draggable onDragEnd={(e) => pickLocation(e.nativeEvent.coordinate)} />
            ) : null}
          </MapView>

          <Field label={t('form.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={40} />
          <Field label={t('form.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" maxLength={120} />
          <Field label={t('form.website')} value={website} onChangeText={setWebsite} keyboardType="url" autoCapitalize="none" maxLength={200} />
          <Field label={t('form.hours')} value={hours} onChangeText={setHours} placeholder={t('form.hoursPlaceholder')} maxLength={500} />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('form.published')}</Text>
            <Switch value={published} onValueChange={setPublished} trackColor={{ true: colors.primary }} />
          </View>

          <Pressable style={[styles.primary, saving && styles.disabled]} onPress={save} disabled={saving}>
            {saving ? <ActivityIndicator color={colors.primaryText} /> : <Text style={styles.primaryText}>{t('common.save')}</Text>}
          </Pressable>
          {id ? (
            <Pressable onPress={confirmDelete}>
              <Text style={styles.delete}>{t('common.delete')}</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

function Field({ label, multiline, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline]}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { marginTop: 60, padding: 24, textAlign: 'center', color: colors.muted },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14, paddingBottom: 48 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
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
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipText: { fontSize: 14, color: colors.text },
  chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  secondary: { paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' },
  secondaryText: { color: colors.primary, fontWeight: '600' },
  map: { height: 260, borderRadius: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: { fontSize: 16, color: colors.text },
  primary: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  disabled: { opacity: 0.5 },
  primaryText: { color: colors.primaryText, fontSize: 16, fontWeight: '600' },
  delete: { textAlign: 'center', color: colors.danger, paddingVertical: 12 },
});
