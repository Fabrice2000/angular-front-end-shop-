import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ProductsActions from './products.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { ToastService } from '../../services/toast.service';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);
  private toast = inject(ToastService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      mergeMap((q) =>
        this.api.getProducts(q as any).pipe(
          map((res) => ProductsActions.loadProductsSuccess({ count: res.count, results: res.results })),
          catchError((error) => {
            this.toast.error('Erreur lors du chargement des produits.');
            return of(ProductsActions.loadProductsFailure({ error }));
          })
        )
      )
    )
  );

  loadRating$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadRating),
      mergeMap(({ id }) =>
        this.api.getRating(id).pipe(
          map((res) => ProductsActions.loadRatingSuccess({ id: res.product_id, avg_rating: res.avg_rating, count: res.count })),
          catchError((error) => of(ProductsActions.loadRatingFailure({ error })))
        )
      )
    )
  );
}
