import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/theme';
import { useSettings } from '@/context/SettingsProvider';

/** Shows the selected city; opens the city picker on press. */
export function CityButton() {
  const { city } = useSettings();
  return (
    <Pressable onPress={() => router.push('/city-picker')} style={styles.button} accessibilityRole="button">
      <Text style={styles.text} numberOfLines={1}>
        📍 {city.name} ▾
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: { fontSize: 16, fontWeight: '600', color: colors.text },
});
