import { useCallback, useEffect, useState } from 'react';

import type { CategorySlug } from '@/constants/categories';
import { fetchBusinessesInBox } from './api';
import type { BoundingBox, Business } from './types';

interface Result {
  key: string;
  businesses: Business[];
  error: string | null;
}

/**
 * Loads businesses for a bounding box and category. Previous results stay visible
 * while a new request is in flight, and responses for outdated queries are dropped.
 */
export function useBusinesses(box: BoundingBox, category: CategorySlug | null) {
  const { minLat, maxLat, minLng, maxLng } = box;
  const [reloadToken, setReloadToken] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const key = [minLat, maxLat, minLng, maxLng, category, reloadToken].join('|');

  useEffect(() => {
    let cancelled = false;
    fetchBusinessesInBox({ minLat, maxLat, minLng, maxLng }, category).then(
      (businesses) => {
        if (!cancelled) setResult({ key, businesses, error: null });
      },
      (e: unknown) => {
        if (!cancelled) setResult({ key, businesses: [], error: e instanceof Error ? e.message : String(e) });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [key, minLat, maxLat, minLng, maxLng, category]);

  const reload = useCallback(() => setReloadToken((n) => n + 1), []);
  const loading = result?.key !== key;

  return {
    businesses: result?.businesses ?? [],
    loading,
    error: loading ? null : (result?.error ?? null),
    reload,
  };
}
