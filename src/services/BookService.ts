import type { ApiResponse, Book } from '../types/Book';

export interface IBookService {
  getBooks(page?: number, search?: string, topic?: string): Promise<ApiResponse>;
  getBookById(id: number): Promise<Book>;
}

export class BookService implements IBookService {
  private readonly baseUrl = 'https://gutendex.com/books';

  async getBooks(page: number = 1, search?: string, topic?: string): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      
      if (search) {
        params.append('search', search);
      }
      
      if (topic) {
        params.append('topic', topic);
      }

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  async getBookById(id: number): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  }
}
