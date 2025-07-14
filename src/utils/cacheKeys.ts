// Cache key utilities for SWR
export const createBooksCacheKey = (page: number, search?: string, topic?: string): string => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search?.trim()) params.append('search', search.trim());
  if (topic?.trim()) params.append('topic', topic.trim());
  
  return `books?${params.toString()}`;
};

export const createBookCacheKey = (id: number): string => {
  return `book/${id}`;
};

// Cache prefixes for different data types
export const CACHE_KEYS = {
  BOOKS: 'books',
  BOOK_DETAIL: 'book',
  GENRES: 'genres',
} as const;
