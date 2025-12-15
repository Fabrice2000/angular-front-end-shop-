import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.reducer';

export const selectAdminState = createFeatureSelector<AdminState>('admin');

export const selectAdminStats = createSelector(
  selectAdminState,
  (state) => state.stats
);

export const selectAdminLoading = createSelector(
  selectAdminState,
  (state) => state.loading
);

export const selectAdminError = createSelector(
  selectAdminState,
  (state) => state.error
);

export const selectTotalRevenue = createSelector(
  selectAdminStats,
  (stats) => stats?.totalRevenue || 0
);

export const selectTotalOrders = createSelector(
  selectAdminStats,
  (stats) => stats?.totalOrders || 0
);

export const selectTopProducts = createSelector(
  selectAdminStats,
  (stats) => stats?.topProducts || []
);

export const selectRevenueByMonth = createSelector(
  selectAdminStats,
  (stats) => stats?.revenueByMonth || []
);
