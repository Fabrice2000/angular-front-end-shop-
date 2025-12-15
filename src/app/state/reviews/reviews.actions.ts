import { createAction, props } from '@ngrx/store';

export interface Review {
  id: string;
  productId: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsState {
  [productId: string]: Review[];
}

// Load reviews for a product
export const loadReviews = createAction(
  '[Reviews] Load Reviews',
  props<{ productId: string }>()
);

export const loadReviewsSuccess = createAction(
  '[Reviews] Load Reviews Success',
  props<{ productId: string; reviews: Review[] }>()
);

export const loadReviewsFailure = createAction(
  '[Reviews] Load Reviews Failure',
  props<{ error: any }>()
);

// Create a new review
export const createReview = createAction(
  '[Reviews] Create Review',
  props<{ productId: string; rating: number; comment: string }>()
);

export const createReviewSuccess = createAction(
  '[Reviews] Create Review Success',
  props<{ review: Review }>()
);

export const createReviewFailure = createAction(
  '[Reviews] Create Review Failure',
  props<{ error: any }>()
);

// Clear reviews
export const clearReviews = createAction('[Reviews] Clear Reviews');
