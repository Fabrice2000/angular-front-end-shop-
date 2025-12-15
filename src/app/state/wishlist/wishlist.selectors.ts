import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from './wishlist.reducer';

export const selectWishlistState = createFeatureSelector<WishlistState>('wishlist');

export const selectWishlistProductIds = createSelector(
  selectWishlistState,
  (state) => state.productIds
);

export const selectWishlistLoading = createSelector(
  selectWishlistState,
  (state) => state.loading
);

export const selectWishlistError = createSelector(
  selectWishlistState,
  (state) => state.error
);

export const selectWishlistCount = createSelector(
  selectWishlistProductIds,
  (productIds) => productIds.length
);

export const selectIsInWishlist = (productId: string) =>
  createSelector(selectWishlistProductIds, (productIds) =>
    productIds.includes(productId)
  );
