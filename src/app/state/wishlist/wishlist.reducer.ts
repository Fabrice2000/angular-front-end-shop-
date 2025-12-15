import { createReducer, on } from '@ngrx/store';
import * as WishlistActions from './wishlist.actions';

export interface WishlistState {
  productIds: string[];
  loading: boolean;
  error: any | null;
}

export const initialWishlistState: WishlistState = {
  productIds: [],
  loading: false,
  error: null,
};

const saveToLocalStorage = (productIds: string[]) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(productIds));
  } catch (err) {
    console.error('Failed to save wishlist to localStorage', err);
  }
};

const loadFromLocalStorage = (): string[] => {
  try {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Failed to load wishlist from localStorage', err);
    return [];
  }
};

// Load from localStorage on initialization
const initialState: WishlistState = {
  ...initialWishlistState,
  productIds: loadFromLocalStorage(),
};

export const wishlistReducer = createReducer(
  initialState,

  // Add to wishlist
  on(WishlistActions.addToWishlist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WishlistActions.addToWishlistSuccess, (state, { productId }) => {
    const newProductIds = state.productIds.includes(productId)
      ? state.productIds
      : [...state.productIds, productId];
    saveToLocalStorage(newProductIds);
    return {
      ...state,
      productIds: newProductIds,
      loading: false,
    };
  }),
  on(WishlistActions.addToWishlistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Remove from wishlist
  on(WishlistActions.removeFromWishlist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WishlistActions.removeFromWishlistSuccess, (state, { productId }) => {
    const newProductIds = state.productIds.filter((id) => id !== productId);
    saveToLocalStorage(newProductIds);
    return {
      ...state,
      productIds: newProductIds,
      loading: false,
    };
  }),
  on(WishlistActions.removeFromWishlistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load wishlist
  on(WishlistActions.loadWishlist, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WishlistActions.loadWishlistSuccess, (state, { productIds }) => {
    saveToLocalStorage(productIds);
    return {
      ...state,
      productIds,
      loading: false,
    };
  }),
  on(WishlistActions.loadWishlistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Toggle wishlist
  on(WishlistActions.toggleWishlist, (state, { productId }) => {
    const newProductIds = state.productIds.includes(productId)
      ? state.productIds.filter((id) => id !== productId)
      : [...state.productIds, productId];
    saveToLocalStorage(newProductIds);
    return {
      ...state,
      productIds: newProductIds,
    };
  }),

  // Clear wishlist
  on(WishlistActions.clearWishlist, (state) => {
    saveToLocalStorage([]);
    return {
      ...state,
      productIds: [],
    };
  })
);
