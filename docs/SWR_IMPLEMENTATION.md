# SWR Implementation for Book Discovery App

This document outlines the implementation of SWR (Stale While Revalidate) for data fetching in the Book Discovery application.

## Overview

SWR is a data fetching library that provides features like caching, revalidation, focus tracking, refetching on intervals, and more. It helps improve the user experience by:

- **Caching**: Automatically caches responses to reduce redundant API calls
- **Stale While Revalidate**: Shows cached data immediately while fetching fresh data in the background
- **Error Handling**: Built-in error retry logic with exponential backoff
- **Real-time**: Automatically revalidates data when the user refocuses the window
- **Performance**: Reduces loading times through intelligent caching strategies

## Implementation Details

### 1. Hooks Structure

#### `useBooks` Hook (`src/hooks/useBooks.ts`)
- Fetches paginated book data from the Gutendx API
- Supports search and genre filtering
- Returns books array, pagination info, loading state, and error state
- Cache duration: 5 seconds with `keepPreviousData` for smooth transitions

#### `useBook` Hook (`src/hooks/useBook.ts`)
- Fetches individual book details by ID
- Cache duration: 30 seconds (book details change less frequently)
- Optimized for book detail pages

#### `useGenres` Hook (`src/hooks/useBooks.ts`)
- Extracts and processes genre data from the first page of books
- Provides cleaned and sorted genre list for filtering

#### `useSearchPreferences` Hook (`src/hooks/useSearchPreferences.ts`)
- Manages search query and genre filter persistence in localStorage
- Automatically saves and restores user preferences across sessions

### 2. Global Configuration

#### SWR Provider (`src/providers/SWRProvider.tsx`)
Global SWR configuration includes:
- **revalidateOnFocus**: false (prevents unnecessary requests on window focus)
- **revalidateOnReconnect**: true (revalidates when internet connection is restored)
- **errorRetryCount**: 3 (retries failed requests up to 3 times)
- **errorRetryInterval**: 1000ms (1 second between retries)
- **dedupingInterval**: 5000ms (prevents duplicate requests within 5 seconds)

### 3. Cache Key Management

#### Cache Utilities (`src/utils/cacheKeys.ts`)
- Consistent cache key generation for different data types
- Supports parameterized queries for books
- Separate cache keys for book lists and individual book details

### 4. Key Features

#### Automatic Caching
- API responses are automatically cached using intelligent cache keys
- Cache keys include all query parameters (page, search, genre)
- Different cache durations for different data types

#### Background Revalidation
- Data is revalidated in the background while showing cached content
- Users see instant results from cache, then updates when fresh data arrives

#### Error Handling
- Automatic retry with exponential backoff
- User-friendly error messages with retry buttons
- Graceful fallback to cached data when possible

#### Performance Optimizations
- `keepPreviousData`: Shows previous page data while loading new pages
- Deduplication prevents multiple identical requests
- Optimized cache expiration times based on data volatility

### 5. Integration Points

#### Home Page (`src/pages/Home.tsx`)
- Uses `useBooks` for main book listing
- Uses `useGenres` for filter options
- Uses `useSearchPreferences` for persistent search state
- Automatic pagination with SWR cache management

#### Book Detail Page (`src/pages/BookDetail.tsx`)
- Uses `useBook` for individual book data
- Optimized caching for detailed book information
- Integrated with wishlist functionality

#### App Component (`src/App.tsx`)
- Wraps the entire application with `SWRProvider`
- Ensures consistent SWR configuration across all components

## Benefits

### User Experience
- **Instant Loading**: Cached data shows immediately
- **Smooth Navigation**: Previous data shown while new data loads
- **Persistent Preferences**: Search and filter state saved across sessions
- **Reliable Error Handling**: Automatic retries and user feedback

### Developer Experience
- **Simple API**: Easy-to-use hooks replace complex state management
- **Type Safety**: Full TypeScript support with proper typing
- **Debugging**: Built-in developer tools and error tracking
- **Maintainable**: Clean separation of concerns with custom hooks

### Performance
- **Reduced API Calls**: Intelligent caching reduces server load
- **Faster Page Loads**: Cached data eliminates loading delays
- **Bandwidth Optimization**: Only fetches when necessary
- **Memory Efficient**: Automatic cache cleanup and management

## Usage Examples

### Basic Book Fetching
```typescript
const { books, isLoading, error } = useBooks(page, searchQuery, genre);
```

### Individual Book Details
```typescript
const { book, isLoading, error } = useBook(bookId);
```

### Search Preferences
```typescript
const { searchQuery, selectedGenre, updateSearchQuery } = useSearchPreferences();
```

### Manual Revalidation
```typescript
const { mutate } = useBooks(page);
// Force refresh
mutate();
```

## Best Practices

1. **Cache Key Consistency**: Use utility functions for generating cache keys
2. **Error Boundaries**: Implement proper error handling at component level
3. **Loading States**: Always handle loading states for better UX
4. **Cache Invalidation**: Use `mutate` function for manual cache updates
5. **Performance Monitoring**: Monitor cache hit rates and API usage

## Future Enhancements

- **Prefetching**: Preload next page data for faster navigation
- **Offline Support**: Cache data for offline reading capabilities
- **Real-time Updates**: WebSocket integration for live data updates
- **Advanced Filtering**: More sophisticated cache invalidation strategies
