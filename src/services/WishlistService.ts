import type { WishlistItem } from '../types/Book';

export interface IWishlistService {
  getWishlist(): WishlistItem[];
  addToWishlist(item: WishlistItem): void;
  removeFromWishlist(id: number): void;
  isInWishlist(id: number): boolean;
  clearWishlist(): void;
}

export class LocalStorageWishlistService implements IWishlistService {
  private readonly storageKey = 'bookWishlist';

  getWishlist(): WishlistItem[] {
    try {
      const wishlist = localStorage.getItem(this.storageKey);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error);
      return [];
    }
  }

  addToWishlist(item: WishlistItem): void {
    try {
      const wishlist = this.getWishlist();
      if (!this.isInWishlist(item.id)) {
        wishlist.push(item);
        localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  }

  removeFromWishlist(id: number): void {
    try {
      const wishlist = this.getWishlist();
      const updatedWishlist = wishlist.filter(item => item.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }

  isInWishlist(id: number): boolean {
    return this.getWishlist().some(item => item.id === id);
  }

  clearWishlist(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  }
}
