import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(selectCartState, (state) => state.items);

export const selectCartTotal = createSelector(selectCartState, (state) => state.totalPrice);

export const selectCartCount = createSelector(selectCartState, (state) => state.count);

export const selectCartDiscount = createSelector(selectCartState, (state) => state.discount);

export const selectCartLoading = createSelector(selectCartState, (state) => state.loading);

export const selectCartError = createSelector(selectCartState, (state) => state.error);

export const selectCartFinalTotal = createSelector(
  selectCartTotal,
  selectCartDiscount,
  (total, discount) => total - discount,
);
