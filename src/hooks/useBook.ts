import useSWR from 'swr';
import type { Book } from '../types/Book';
import { BookService } from '../services/BookService';
import { createBookCacheKey } from '../utils/cacheKeys';

// Create a single instance of BookService
const bookService = new BookService();

// Fetcher function for individual book details
const bookFetcher = async (key: string): Promise<Book> => {
  const id = parseInt(key.split('/')[1]);
  return bookService.getBookById(id);
};

// Custom hook for fetching a single book by ID
export const useBook = (id: number) => {
  const key = id ? createBookCacheKey(id) : null;
  
  const { data, error, isLoading, mutate } = useSWR<Book>(
    key,
    bookFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      dedupingInterval: 30000, // Cache for 30 seconds (book details change less frequently)
    }
  );

  return {
    book: data,
    isLoading,
    error: error?.message || null,
    mutate,
  };
};
