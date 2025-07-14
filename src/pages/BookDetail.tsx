import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { WishlistItem } from '../types/Book';
import { LocalStorageWishlistService } from '../services/WishlistService';
import { getBookCoverImage, getBookAuthors } from '../utils/bookUtils';
import { useBook } from '../hooks/useBook';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const wishlistService = useMemo(() => new LocalStorageWishlistService(), []);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Use SWR to fetch book details
  const { book, isLoading, error, mutate } = useBook(id ? parseInt(id) : 0);

  // Update wishlist status when book changes
  useEffect(() => {
    if (book) {
      setIsWishlisted(wishlistService.isInWishlist(book.id));
    }
  }, [book, wishlistService]);

  const handleWishlistToggle = () => {
    if (!book) return;

    const wishlistItem: WishlistItem = {
      id: book.id,
      title: book.title,
      authors: book.authors,
      coverImage: getBookCoverImage(book),
      subjects: book.subjects
    };

    if (isWishlisted) {
      wishlistService.removeFromWishlist(book.id);
      setIsWishlisted(false);
    } else {
      wishlistService.addToWishlist(wishlistItem);
      setIsWishlisted(true);
    }
  };

  const handleRetry = () => {
    mutate();
  };

  if (isLoading) return <Loading message="Loading book details..." />;
  if (error) return <ErrorMessage message={error} onRetry={handleRetry} />;
  if (!book) return <ErrorMessage message="Book not found" />;

  const coverImage = getBookCoverImage(book);
  const authors = getBookAuthors(book);

  const downloadLinks = Object.entries(book.formats).filter(([format]) => 
    format.includes('text') || format.includes('epub') || format.includes('pdf')
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
        >
          ← Back to Books
        </Link>
      </div>

      <div className="card p-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl overflow-hidden shadow-2xl">
                {coverImage !== '/placeholder-book.jpg' ? (
                  <img
                    src={coverImage}
                    alt={book.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center text-white text-8xl">
                    📖
                  </div>
                )}
                <button
                  onClick={handleWishlistToggle}
                  className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 backdrop-blur-sm transform hover:scale-110 ${
                    isWishlisted 
                      ? 'bg-red-100 bg-opacity-90 text-red-500' 
                      : 'bg-white bg-opacity-90 text-gray-600 hover:bg-red-50'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 italic mb-2">by {authors}</p>
              <p className="text-sm text-gray-500">Book ID: {book.id}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-primary-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {book.download_count.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Downloads</div>
              </div>
              <div className="bg-secondary-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-secondary-600">
                  {book.languages.join(', ').toUpperCase()}
                </div>
                <div className="text-sm text-gray-600">Language</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {book.copyright ? 'No' : 'Yes'}
                </div>
                <div className="text-sm text-gray-600">Public Domain</div>
              </div>
            </div>

            {/* Subjects/Genres */}
            {book.subjects.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Subjects & Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 10).map((subject, index) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bookshelves */}
            {book.bookshelves.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Bookshelves</h3>
                <div className="flex flex-wrap gap-2">
                  {book.bookshelves.map((shelf, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {shelf}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download Links */}
            {downloadLinks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Download Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {downloadLinks.map(([format, url], index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                    >
                      <span className="font-medium text-gray-700">
                        {format.includes('epub') ? 'EPUB' : 
                         format.includes('pdf') ? 'PDF' : 
                         format.includes('text') ? 'Text' : 
                         format.split('/')[1]?.toUpperCase()}
                      </span>
                      <span className="text-primary-600">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 ${isWishlisted ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isWishlisted ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
              </button>
              <Link to="/" className="btn-secondary text-center">
                Browse More Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
