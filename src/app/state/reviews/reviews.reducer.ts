import { createReducer, on } from '@ngrx/store';
import * as ReviewsActions from './reviews.actions';
import { Review } from './reviews.actions';

export interface ReviewsByProduct {
  [productId: string]: Review[];
}

export interface ReviewsState {
  reviews: ReviewsByProduct;
  loading: boolean;
  error: any | null;
}

export const initialReviewsState: ReviewsState = {
  reviews: {},
  loading: false,
  error: null,
};

export const reviewsReducer = createReducer(
  initialReviewsState,

  // Load reviews
  on(ReviewsActions.loadReviews, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReviewsActions.loadReviewsSuccess, (state, { productId, reviews }) => ({
    ...state,
    reviews: {
      ...state.reviews,
      [productId]: reviews,
    },
    loading: false,
  })),
  on(ReviewsActions.loadReviewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create review
  on(ReviewsActions.createReview, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReviewsActions.createReviewSuccess, (state, { review }) => {
    const productReviews = state.reviews[review.productId] || [];
    return {
      ...state,
      reviews: {
        ...state.reviews,
        [review.productId]: [review, ...productReviews],
      },
      loading: false,
    };
  }),
  on(ReviewsActions.createReviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear reviews
  on(ReviewsActions.clearReviews, () => initialReviewsState)
);
