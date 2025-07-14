import useSWR from 'swr';
import type { ApiResponse } from '../types/Book';
import { BookService } from '../services/BookService';
import { createBooksCacheKey } from '../utils/cacheKeys';

// Create a single instance of BookService
const bookService = new BookService();

// Fetcher function for SWR
const fetcher = async (key: string): Promise<ApiResponse> => {
  const [, queryString] = key.split('?');
  const params = new URLSearchParams(queryString);
  const page = parseInt(params.get('page') || '1');
  const search = params.get('search') || undefined;
  const topic = params.get('topic') || undefined;
  
  return bookService.getBooks(page, search, topic);
};

// Custom hook for fetching books with SWR
export const useBooks = (page: number = 1, search?: string, topic?: string) => {
  // Create a cache key based on the parameters
  const key = createBooksCacheKey(page, search, topic);
  
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      dedupingInterval: 5000, // Cache for 5 seconds
      keepPreviousData: true, // Keep previous data while loading new data
    }
  );

  return {
    books: data?.results || [],
    totalCount: data?.count || 0,
    hasNext: !!data?.next,
    hasPrevious: !!data?.previous,
    isLoading,
    error: error?.message || null,
    mutate, // For manual revalidation
  };
};

// Custom hook for fetching all genres (for the first page without filters)
export const useGenres = () => {
  const { books, isLoading, error } = useBooks(1); // Get first page without filters
  
  // Extract genres from books
  const genres = books.reduce<string[]>((acc, book) => {
    book.subjects.forEach(subject => {
      // Clean up subject strings and extract meaningful genres
      const cleanSubject = subject
        .replace(/^--\s*/, '') // Remove leading dashes
        .replace(/\s*--.*$/, '') // Remove everything after double dashes
        .trim();
        
      if (cleanSubject && !acc.includes(cleanSubject)) {
        acc.push(cleanSubject);
      }
    });
    return acc;
  }, []).sort();

  return {
    genres,
    isLoading,
    error,
  };
};
