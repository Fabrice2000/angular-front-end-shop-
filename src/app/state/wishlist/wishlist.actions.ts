import { createAction, props } from '@ngrx/store';

// Add to wishlist
export const addToWishlist = createAction(
  '[Wishlist] Add Product',
  props<{ productId: string }>()
);

export const addToWishlistSuccess = createAction(
  '[Wishlist] Add Product Success',
  props<{ productId: string }>()
);

export const addToWishlistFailure = createAction(
  '[Wishlist] Add Product Failure',
  props<{ error: any }>()
);

// Remove from wishlist
export const removeFromWishlist = createAction(
  '[Wishlist] Remove Product',
  props<{ productId: string }>()
);

export const removeFromWishlistSuccess = createAction(
  '[Wishlist] Remove Product Success',
  props<{ productId: string }>()
);

export const removeFromWishlistFailure = createAction(
  '[Wishlist] Remove Product Failure',
  props<{ error: any }>()
);

// Load wishlist
export const loadWishlist = createAction('[Wishlist] Load');

export const loadWishlistSuccess = createAction(
  '[Wishlist] Load Success',
  props<{ productIds: string[] }>()
);

export const loadWishlistFailure = createAction(
  '[Wishlist] Load Failure',
  props<{ error: any }>()
);

// Toggle wishlist (add if not present, remove if present)
export const toggleWishlist = createAction(
  '[Wishlist] Toggle Product',
  props<{ productId: string }>()
);

// Clear wishlist
export const clearWishlist = createAction('[Wishlist] Clear');
