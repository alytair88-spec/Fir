import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthProvider';
import { useSettings } from '@/context/SettingsProvider';

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const { t } = useSettings();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setMessage(null);
    try {
      if (mode === 'signIn') {
        await signIn(email.trim(), password);
      } else {
        const needsConfirmation = await signUp(email.trim(), password);
        if (needsConfirmation) {
          setMessage(t('auth.checkEmail'));
          setMode('signIn');
        }
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const canSubmit = email.includes('@') && password.length >= 6 && !busy;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.title')}</Text>
      <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder={t('auth.email')}
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder={t('auth.password')}
        placeholderTextColor={colors.muted}
        secureTextEntry
        autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Pressable style={[styles.button, !canSubmit && styles.disabled]} onPress={submit} disabled={!canSubmit}>
        {busy ? (
          <ActivityIndicator color={colors.primaryText} />
        ) : (
          <Text style={styles.buttonText}>{mode === 'signIn' ? t('auth.signIn') : t('auth.signUp')}</Text>
        )}
      </Pressable>
      <Pressable onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}>
        <Text style={styles.switch}>{mode === 'signIn' ? t('auth.switchToSignUp') : t('auth.switchToSignIn')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 15, color: colors.muted, lineHeight: 21 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  message: { color: colors.warningText, backgroundColor: colors.warningBg, padding: 10, borderRadius: 8 },
  button: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  disabled: { opacity: 0.5 },
  buttonText: { color: colors.primaryText, fontSize: 16, fontWeight: '600' },
  switch: { textAlign: 'center', color: colors.primary, paddingVertical: 8 },
});
