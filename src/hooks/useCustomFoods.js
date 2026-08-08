import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

function mapFood(f) {
  return { id: f._id, name: f.name, seconds: f.seconds, category: f.category || 'Custom', custom: true };
}

export function useCustomFoods() {
  const [customFoods, setCustomFoods] = useState([]);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/foods')
      .then(({ foods }) => {
        if (!cancelled) setCustomFoods(foods.map(mapFood));
      })
      .catch((err) => console.error('Failed to load custom foods:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  const addCustomFood = useCallback(async (name, seconds) => {
    const { food } = await api.post('/foods', { name, seconds });
    const mapped = mapFood(food);
    setCustomFoods((prev) => [...prev, mapped]);
    return mapped;
  }, []);

  const removeCustomFood = useCallback((id) => {
    setCustomFoods((prev) => prev.filter((f) => f.id !== id));
    api.delete(`/foods/${id}`).catch((err) => console.error('Failed to remove custom food:', err));
  }, []);

  const updateCustomFood = useCallback((id, seconds) => {
    setCustomFoods((prev) => prev.map((f) => (f.id === id ? { ...f, seconds } : f)));
    api.patch(`/foods/${id}`, { seconds }).catch((err) => console.error('Failed to update custom food:', err));
  }, []);

  return { customFoods, addCustomFood, removeCustomFood, updateCustomFood };
}
