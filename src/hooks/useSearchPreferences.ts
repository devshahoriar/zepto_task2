import { useState, useEffect } from 'react';

interface SearchPreferences {
  searchQuery: string;
  selectedGenre: string;
}

const STORAGE_KEY = 'book-search-preferences';

export const useSearchPreferences = () => {
  const [preferences, setPreferences] = useState<SearchPreferences>({
    searchQuery: '',
    selectedGenre: '',
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      }
    } catch (error) {
      console.error('Error loading search preferences:', error);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving search preferences:', error);
    }
  }, [preferences]);

  const updateSearchQuery = (query: string) => {
    setPreferences(prev => ({ ...prev, searchQuery: query }));
  };

  const updateSelectedGenre = (genre: string) => {
    setPreferences(prev => ({ ...prev, selectedGenre: genre }));
  };

  const clearPreferences = () => {
    setPreferences({ searchQuery: '', selectedGenre: '' });
  };

  return {
    searchQuery: preferences.searchQuery,
    selectedGenre: preferences.selectedGenre,
    updateSearchQuery,
    updateSelectedGenre,
    clearPreferences,
  };
};
