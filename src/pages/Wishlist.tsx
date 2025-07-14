import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { WishlistItem } from '../types/Book';
import { LocalStorageWishlistService } from '../services/WishlistService';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const wishlistService = useMemo(() => new LocalStorageWishlistService(), []);

  useEffect(() => {
    setWishlist(wishlistService.getWishlist());
  }, [wishlistService]);

  const handleRemoveFromWishlist = (id: number) => {
    wishlistService.removeFromWishlist(id);
    setWishlist(wishlistService.getWishlist());
  };

  const clearWishlist = () => {
    wishlistService.clearWishlist();
    setWishlist([]);
  };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            ❤️ Your Wishlist
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Books you've saved for later reading
          </p>
        </div>

        <div className="card flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="text-6xl mb-6">📚</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-8 max-w-md">
            Start exploring books and add your favorites to your wishlist by clicking the heart icon.
          </p>
          <Link to="/" className="btn-primary">
            Discover Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          ❤️ Your Wishlist
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-6">
          {wishlist.length} book{wishlist.length !== 1 ? 's' : ''} saved for later reading
        </p>
        <button 
          onClick={clearWishlist}
          className="btn-secondary"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((book) => (
          <div key={book.id} className="card group cursor-pointer transform hover:-translate-y-2 transition-all duration-300 h-full flex flex-col animate-fade-in">
            <div className="relative h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-primary-400 to-secondary-400">
              {book.coverImage && book.coverImage !== '/placeholder-book.jpg' ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-5xl">
                  📖
                </div>
              )}
              <button
                className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 backdrop-blur-sm transform hover:scale-110 bg-red-100 bg-opacity-90 text-red-500"
                onClick={() => handleRemoveFromWishlist(book.id)}
                aria-label="Remove from wishlist"
              >
                ❤️
              </button>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 leading-tight">
                <Link 
                  to={`/book/${book.id}`} 
                  className="text-gray-800 hover:text-primary-600 transition-colors duration-200"
                >
                  {book.title}
                </Link>
              </h3>
              
              <p className="text-gray-600 text-sm italic mb-4">
                {book.authors.map(author => author.name).join(', ') || 'Unknown Author'}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4 flex-grow">
                {book.subjects.slice(0, 2).map((subject, index) => (
                  <span 
                    key={index} 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {subject.length > 20 ? `${subject.substring(0, 20)}...` : subject}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                <span className="font-medium">ID: {book.id}</span>
                <button
                  onClick={() => handleRemoveFromWishlist(book.id)}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
