import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Book } from '../../types/Book'
import {
  getBookAuthors,
  getBookCoverImage,
  getBookGenres,
} from '../../utils/bookUtils'

interface BookCardProps {
  book: Book
  isWishlisted: boolean
  onWishlistToggle: (book: Book) => void
}

const BookCard = ({ book, isWishlisted, onWishlistToggle }: BookCardProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const coverImage = getBookCoverImage(book)
  const authors = getBookAuthors(book)
  const genres = getBookGenres(book)

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onWishlistToggle(book)
  }

  return (
    <Link
      to={`/book/${book.id}`}
      className='card group cursor-pointer transform-gpu hover:-translate-y-2 transition-all duration-300 h-full flex flex-col animate-fade-in-delayed'
    >
      <div className='relative h-64 overflow-hidden rounded-t-xl bg-gradient-to-br from-slate-200 to-slate-300 block shadow-inner'>
        {!imageError && coverImage !== '/placeholder-book.jpg' ? (
          <>
            {!imageLoaded && (
              <div className='absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse flex items-center justify-center'>
                <div className='text-slate-400 text-4xl'>📚</div>
              </div>
            )}
            <img
              src={coverImage}
              alt={book.title}
              className={`w-full h-full object-contain bg-white group-hover:scale-105 transition-all duration-300 ${
                !imageLoaded ? 'opacity-0' : 'opacity-100'
              } shadow-sm`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading='lazy'
              style={{ objectPosition: 'center' }}
            />
          </>
        ) : (
          <div className='w-full h-full flex flex-col items-center justify-center text-slate-600 bg-gradient-to-br from-slate-100 to-slate-200'>
            <div className='text-6xl mb-2'>📖</div>
            <div className='text-xs font-medium text-center px-2 leading-tight opacity-75'>
              {book.title.length > 30
                ? `${book.title.substring(0, 30)}...`
                : book.title}
            </div>
          </div>
        )}
        <button
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 backdrop-blur-md transform hover:scale-110 z-10 border border-white border-opacity-20 ${
            isWishlisted
              ? 'bg-red-500 bg-opacity-90 text-white shadow-lg'
              : 'bg-white bg-opacity-80 text-gray-700 hover:bg-red-50 shadow-md'
          }`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      <div className='p-6 flex-grow flex flex-col'>
        <h3 className='text-lg font-semibold mb-2 line-clamp-2 leading-tight'>
          {book.title}
        </h3>

        <p className='text-gray-600 text-sm italic'>{authors}</p>

        <div className='flex flex-wrap gap-2 flex-grow'>
          {genres.slice(0, 2).map((genre, index) => (
            <span key={index} className=''>
              {genre.length > 20 ? `${genre.substring(0, 20)}...` : genre}
            </span>
          ))}
        </div>

        <div className='flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-3 mt-auto'>
          <span className='font-medium'>ID: {book.id}</span>
          <span className='text-gray-600 font-medium'>
            {book.download_count.toLocaleString()} downloads
          </span>
        </div>
      </div>
    </Link>
  )
}

export default BookCard
