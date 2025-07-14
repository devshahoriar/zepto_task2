export interface Author {
  name: string;
  birth_year?: number;
  death_year?: number;
}

export interface Format {
  [key: string]: string;
}

export interface Book {
  id: number;
  title: string;
  authors: Author[];
  translators: Author[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright?: boolean;
  media_type: string;
  formats: Format;
  download_count: number;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

export interface WishlistItem {
  id: number;
  title: string;
  authors: Author[];
  coverImage: string;
  subjects: string[];
}
