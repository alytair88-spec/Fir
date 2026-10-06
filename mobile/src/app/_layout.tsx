import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { AuthProvider } from '@/context/AuthProvider';
import { SettingsProvider, useSettings } from '@/context/SettingsProvider';

function RootStack() {
  const { t } = useSettings();
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="city-picker" options={{ presentation: 'modal', title: t('city.choose') }} />
      <Stack.Screen name="business/[id]" options={{ title: '' }} />
      <Stack.Screen name="owner/edit" options={{ title: t('form.newTitle') }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <RootStack />
        </AuthProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
