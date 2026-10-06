import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { colors } from '@/constants/theme';
import { useSettings } from '@/context/SettingsProvider';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const { t } = useSettings();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab.map'),
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('tab.list'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔎" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tab.account'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏪" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
