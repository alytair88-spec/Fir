import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { CategorySlug } from '@/constants/categories';
import { DEFAULT_CITY, type City } from '@/constants/cities';
import { isLang, translate, type Lang, type TranslationKey } from '@/lib/i18n';

const LANG_KEY = 'settings.lang';
const CITY_KEY = 'settings.city';

interface SettingsValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  city: City;
  setCity: (city: City) => void;
  /** Category filter shared by the map and the list; not persisted. */
  category: CategorySlug | null;
  setCategory: (category: CategorySlug | null) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const SettingsContext = createContext<SettingsValue | null>(null);

function deviceLang(): Lang {
  const code = getLocales()[0]?.languageCode;
  return isLang(code) ? code : 'uk';
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(deviceLang);
  const [city, setCityState] = useState<City>(DEFAULT_CITY);
  const [category, setCategory] = useState<CategorySlug | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [[, storedLang], [, storedCity]] = await AsyncStorage.multiGet([LANG_KEY, CITY_KEY]);
        if (isLang(storedLang)) setLangState(storedLang);
        if (storedCity) setCityState(JSON.parse(storedCity) as City);
      } catch {
        // Fall back to defaults if storage is unavailable or corrupted.
      }
    })();
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(LANG_KEY, next).catch(() => {});
  }, []);

  const setCity = useCallback((next: City) => {
    setCityState(next);
    AsyncStorage.setItem(CITY_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const value = useMemo<SettingsValue>(
    () => ({ lang, setLang, city, setCity, category, setCategory, t: (key, params) => translate(lang, key, params) }),
    [lang, setLang, city, setCity, category],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
