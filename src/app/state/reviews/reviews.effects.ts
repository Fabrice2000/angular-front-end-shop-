import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as ReviewsActions from './reviews.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { ToastService } from '../../services/toast.service';

@Injectable()
export class ReviewsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ShopApiService);
  private readonly toast = inject(ToastService);

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
          tap(() => this.toast.success('Avis ajouté avec succès !')),
          map((review) => ReviewsActions.createReviewSuccess({ review })),
          catchError((error) => {
            this.toast.error('Erreur lors de la création de l\'avis.');
            return of(ReviewsActions.createReviewFailure({ error }));
          })
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
