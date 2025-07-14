import { useState, useEffect } from 'react';
import { debounce } from '../../utils/bookUtils';

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onGenreFilter: (genre: string) => void;
  genres: string[];
  searchQuery: string;
  selectedGenre: string;
}

const SearchAndFilters = ({
  onSearch,
  onGenreFilter,
  genres,
  searchQuery,
  selectedGenre
}: SearchAndFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounced search function
  const debouncedSearch = debounce((query: string) => {
    onSearch(query);
  }, 300);

  useEffect(() => {
    debouncedSearch(localSearchQuery);
  }, [localSearchQuery, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onGenreFilter(e.target.value);
  };

  const clearFilters = () => {
    setLocalSearchQuery('');
    onSearch('');
    onGenreFilter('');
  };

  return (
    <div className="card p-6 mb-8 animate-slide-up">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search books by title..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="input-field pl-12 pr-12"
            />
            {localSearchQuery && (
              <button
                onClick={() => setLocalSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 text-lg"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="w-full lg:w-64">
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="input-field cursor-pointer"
          >
            <option value="">All Genres</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre.length > 40 ? `${genre.substring(0, 40)}...` : genre}
              </option>
            ))}
          </select>
        </div>

        {(localSearchQuery || selectedGenre) && (
          <button 
            onClick={clearFilters} 
            className="btn-primary whitespace-nowrap lg:w-auto w-full"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;
