import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'abou3yta.favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false); // 👈 عشان أضمن إننا على الـ client

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return; // 👈 مايتشغلش على السيرفر

    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (!isReady) return; // 👈 ما يحفظش قبل ما يقرأ
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites, isReady]);

  const toggleFavorite = useCallback((phoneId: string) => {
    setFavorites(prev =>
      prev.includes(phoneId)
        ? prev.filter(id => id !== phoneId)
        : [...prev, phoneId]
    );
  }, []);

  const isFavorite = useCallback(
    (phoneId: string) => favorites.includes(phoneId),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
    isReady // 👈 ممكن تستخدمها لو عايز تمنع الواجهة تظهر قبل التحميل
  };
}
