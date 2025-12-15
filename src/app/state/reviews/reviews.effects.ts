import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as ReviewsActions from './reviews.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class ReviewsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ShopApiService);

  loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadReviews),
      mergeMap(({ productId }) =>
        this.api.getProductReviews(productId).pipe(
          map((reviews) => ReviewsActions.loadReviewsSuccess({ productId, reviews })),
          catchError((error) => of(ReviewsActions.loadReviewsFailure({ error })))
        )
      )
    )
  );

  createReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.createReview),
      mergeMap(({ productId, rating, comment }) =>
        this.api.createProductReview(productId, rating, comment).pipe(
          map((review) => ReviewsActions.createReviewSuccess({ review })),
          catchError((error) => of(ReviewsActions.createReviewFailure({ error })))
        )
      )
    )
  );

  reloadAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.createReviewSuccess),
      map(({ review }) => ReviewsActions.loadReviews({ productId: review.productId }))
    )
  );
}
