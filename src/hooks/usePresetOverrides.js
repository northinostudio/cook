import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

// Lets the user correct/override a built-in preset's default time without
// losing the original — stored server-side per account as { foodId: seconds }.
export function usePresetOverrides() {
  const [overrides, setOverrides] = useState({});

  useEffect(() => {
    let cancelled = false;
    api
      .get('/overrides')
      .then(({ overrides }) => {
        if (!cancelled) setOverrides(overrides);
      })
      .catch((err) => console.error('Failed to load preset overrides:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  const setOverride = useCallback((foodId, seconds) => {
    setOverrides((prev) => ({ ...prev, [foodId]: seconds }));
    api.put(`/overrides/${foodId}`, { seconds }).catch((err) => console.error('Failed to save override:', err));
  }, []);

  const resetOverride = useCallback((foodId) => {
    setOverrides((prev) => {
      if (!(foodId in prev)) return prev;
      const next = { ...prev };
      delete next[foodId];
      return next;
    });
    api.delete(`/overrides/${foodId}`).catch((err) => console.error('Failed to reset override:', err));
  }, []);

  return { overrides, setOverride, resetOverride };
}
