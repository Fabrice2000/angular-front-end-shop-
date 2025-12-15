import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as WishlistActions from './wishlist.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class WishlistEffects {
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);
  
  addToWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.addToWishlist),
      mergeMap(({ productId }) =>
        this.api.addToWishlist(productId).pipe(
          map(() => WishlistActions.addToWishlistSuccess({ productId })),
          catchError((error) => of(WishlistActions.addToWishlistFailure({ error })))
        )
      )
    )
  );

  removeFromWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.removeFromWishlist),
      mergeMap(({ productId }) =>
        this.api.removeFromWishlist(productId).pipe(
          map(() => WishlistActions.removeFromWishlistSuccess({ productId })),
          catchError((error) => of(WishlistActions.removeFromWishlistFailure({ error })))
        )
      )
    )
  );

  loadWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.loadWishlist),
      mergeMap(() =>
        this.api.getWishlist().pipe(
          map((productIds) => WishlistActions.loadWishlistSuccess({ productIds })),
          catchError((error) => of(WishlistActions.loadWishlistFailure({ error })))
        )
      )
    )
  );
}
