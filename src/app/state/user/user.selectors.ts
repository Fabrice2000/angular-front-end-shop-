import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserProfile = createSelector(
  selectUserState,
  (state) => state.profile
);

export const selectUserOrders = createSelector(
  selectUserState,
  (state) => state.orders
);

export const selectSelectedOrder = createSelector(
  selectUserState,
  (state) => state.selectedOrder
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state) => state.error
);

// Composed selectors
export const selectUserPreferences = createSelector(
  selectUserProfile,
  (profile) => profile?.preferences
);

export const selectDefaultMinRating = createSelector(
  selectUserPreferences,
  (preferences) => preferences?.defaultMinRating || 0
);

export const selectOrdersByStatus = (status: string) =>
  createSelector(selectUserOrders, (orders) =>
    orders.filter((order) => order.status === status)
  );
