import { useState, useCallback, useMemo } from 'react';
import type { Book, WishlistItem } from '../types/Book';
import { LocalStorageWishlistService } from '../services/WishlistService';
import { getBookCoverImage } from '../utils/bookUtils';
import { useBooks, useGenres } from '../hooks/useBooks';
import { useSearchPreferences } from '../hooks/useSearchPreferences';
import BookCard from '../components/BookCard/BookCard';
import SearchAndFilters from '../components/SearchAndFilters/SearchAndFilters';
import Pagination from '../components/Pagination/Pagination';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use search preferences hook for persistent search state
  const {
    searchQuery,
    selectedGenre,
    updateSearchQuery,
    updateSelectedGenre,
  } = useSearchPreferences();

  const wishlistService = useMemo(() => new LocalStorageWishlistService(), []);

  // Use SWR to fetch books
  const { 
    books, 
    totalCount, 
    hasNext, 
    hasPrevious, 
    isLoading, 
    error, 
    mutate: refetchBooks 
  } = useBooks(currentPage, searchQuery || undefined, selectedGenre || undefined);

  // Use SWR to fetch genres
  const { genres } = useGenres();

  // Calculate total pages (approximate, since API doesn't provide exact count)
  const totalPages = Math.ceil(totalCount / 32); // Gutendex returns ~32 books per page

  // Handle search
  const handleSearch = useCallback((query: string) => {
    updateSearchQuery(query);
    setCurrentPage(1);
  }, [updateSearchQuery]);

  // Handle genre filter
  const handleGenreFilter = useCallback((genre: string) => {
    updateSelectedGenre(genre);
    setCurrentPage(1);
  }, [updateSelectedGenre]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle wishlist toggle
  const handleWishlistToggle = useCallback((book: Book) => {
    const wishlistItem: WishlistItem = {
      id: book.id,
      title: book.title,
      authors: book.authors,
      coverImage: getBookCoverImage(book),
      subjects: book.subjects
    };

    if (wishlistService.isInWishlist(book.id)) {
      wishlistService.removeFromWishlist(book.id);
    } else {
      wishlistService.addToWishlist(wishlistItem);
    }
  }, [wishlistService]);

  // Retry function
  const handleRetry = useCallback(() => {
    refetchBooks();
  }, [refetchBooks]);

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          📚 Discover Amazing Books
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Explore thousands of free books from Project Gutenberg
        </p>
      </div>

      <SearchAndFilters
        onSearch={handleSearch}
        onGenreFilter={handleGenreFilter}
        genres={genres}
        searchQuery={searchQuery}
        selectedGenre={selectedGenre}
      />

      {isLoading ? (
        <Loading />
      ) : books.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or clear the filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {books.map((book) => (
              <BookCard
                key={`book-${book.id}-${currentPage}`}
                book={book}
                isWishlisted={wishlistService.isInWishlist(book.id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          />
        </>
      )}
    </div>
  );
};

export default Home;
