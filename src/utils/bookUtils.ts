import type { Book } from '../types/Book';

export const getBookCoverImage = (book: Book): string => {
  return book.formats['image/jpeg'] || 
         book.formats['image/png'] || 
         book.formats['image/gif'] ||
         '/placeholder-book.jpg';
};

export const getBookAuthors = (book: Book): string => {
  return book.authors.map(author => author.name).join(', ') || 'Unknown Author';
};

export const getBookGenres = (book: Book): string[] => {
  return book.subjects.slice(0, 3); // Show first 3 subjects as genres
};

export const extractGenresFromBooks = (books: Book[]): string[] => {
  const allSubjects = books.flatMap(book => book.subjects);
  const uniqueSubjects = [...new Set(allSubjects)];
  return uniqueSubjects.slice(0, 20); // Return top 20 unique subjects
};

export const debounce = <T extends (...args: Parameters<T>) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
