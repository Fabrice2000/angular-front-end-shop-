import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReviewsState } from './reviews.reducer';

export const selectReviewsState = createFeatureSelector<ReviewsState>('reviews');

export const selectAllReviews = createSelector(
  selectReviewsState,
  (state) => state.reviews
);

export const selectReviewsLoading = createSelector(
  selectReviewsState,
  (state) => state.loading
);

export const selectReviewsError = createSelector(
  selectReviewsState,
  (state) => state.error
);

export const selectReviewsByProduct = (productId: string) =>
  createSelector(selectAllReviews, (reviews) => reviews[productId] || []);

export const selectReviewsCountByProduct = (productId: string) =>
  createSelector(selectReviewsByProduct(productId), (reviews) => reviews.length);

export const selectAverageRatingByProduct = (productId: string) =>
  createSelector(selectReviewsByProduct(productId), (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  });
