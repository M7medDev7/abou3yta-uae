import { createContext, useContext, useState, useEffect } from "react";

const FAVORITES_KEY = "abou3yta.favorites";

// نوع البيانات اللي هتتخزن
type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (phoneId: string) => void;
  isFavorite: (phoneId: string) => boolean;
  clearFavorites: () => void;
  favoritesCount: number;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // تحميل البيانات من localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
    }
  }, []);

  // حفظ البيانات في localStorage عند أي تحديث
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error("Error saving favorites:", err);
    }
  }, [favorites]);

  // toggle favorite
  const toggleFavorite = (phoneId: string) => {
    setFavorites((prev) =>
      prev.includes(phoneId)
        ? prev.filter((id) => id !== phoneId)
        : [...prev, phoneId]
    );
  };

  const isFavorite = (phoneId: string) => favorites.includes(phoneId);

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// hook جاهز للاستخدام في أي مكان
// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }
  return context;
}
