interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrevious
}: PaginationProps) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col items-center gap-4 my-12">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className="px-4 py-2 text-sm font-medium text-primary-600 bg-white border-2 border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200"
          aria-label="Previous page"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <span key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500 font-bold">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`min-w-[44px] h-11 flex items-center justify-center text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                    page === currentPage
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500'
                      : 'text-gray-700 bg-white border-gray-200 hover:bg-primary-50 hover:border-primary-300'
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </span>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="px-4 py-2 text-sm font-medium text-primary-600 bg-white border-2 border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200"
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
      
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
