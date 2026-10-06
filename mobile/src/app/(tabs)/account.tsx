import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthForm } from '@/components/AuthForm';
import { BusinessCard } from '@/components/BusinessCard';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useSettings } from '@/context/SettingsProvider';
import { fetchMyBusinesses } from '@/lib/api';
import { LANGUAGES } from '@/lib/i18n';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Business } from '@/lib/types';

export default function AccountScreen() {
  const { session, loading, signOut } = useAuth();
  const { lang, setLang, t } = useSettings();
  const [mine, setMine] = useState<Business[]>([]);
  const [loadingMine, setLoadingMine] = useState(false);
  const userId = session?.user.id;

  // Refresh after returning from the edit screen.
  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        setMine([]);
        return;
      }
      let cancelled = false;
      setLoadingMine(true);
      fetchMyBusinesses(userId)
        .then((list) => !cancelled && setMine(list))
        .catch(() => {})
        .finally(() => !cancelled && setLoadingMine(false));
      return () => {
        cancelled = true;
      };
    }, [userId]),
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.langRow}>
        <Text style={styles.langLabel}>{t('account.language')}:</Text>
        {LANGUAGES.map((l) => (
          <Pressable key={l.code} onPress={() => setLang(l.code)} style={[styles.lang, lang === l.code && styles.langActive]}>
            <Text style={[styles.langText, lang === l.code && styles.langTextActive]}>{l.label}</Text>
          </Pressable>
        ))}
      </View>

      {!isSupabaseConfigured ? (
        <Text style={styles.notice}>{t('account.demo')}</Text>
      ) : loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : !session ? (
        <AuthForm />
      ) : (
        <View style={styles.section}>
          <Text style={styles.email}>{session.user.email}</Text>
          <Text style={styles.title}>{t('account.myBusinesses')}</Text>
          {loadingMine && mine.length === 0 ? <ActivityIndicator color={colors.primary} /> : null}
          {!loadingMine && mine.length === 0 ? <Text style={styles.muted}>{t('account.empty')}</Text> : null}
          {mine.map((b) => (
            <BusinessCard
              key={b.id}
              business={b}
              badge={b.is_published ? undefined : t('account.hidden')}
              onPress={() => router.push({ pathname: '/owner/edit', params: { id: b.id } })}
            />
          ))}
          <Pressable style={styles.primary} onPress={() => router.push('/owner/edit')}>
            <Text style={styles.primaryText}>{t('account.add')}</Text>
          </Pressable>
          <Pressable onPress={signOut}>
            <Text style={styles.signOut}>{t('auth.signOut')}</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 20 },
  langRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  langLabel: { color: colors.muted },
  lang: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, borderWidth: 1, borderColor: colors.border },
  langActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  langText: { color: colors.text, fontSize: 13 },
  langTextActive: { color: colors.primaryText },
  notice: { backgroundColor: colors.warningBg, color: colors.warningText, padding: 12, borderRadius: 10, lineHeight: 20 },
  section: { gap: 10 },
  email: { color: colors.muted },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  muted: { color: colors.muted },
  primary: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  primaryText: { color: colors.primaryText, fontSize: 16, fontWeight: '600' },
  signOut: { textAlign: 'center', color: colors.danger, paddingVertical: 12 },
});
