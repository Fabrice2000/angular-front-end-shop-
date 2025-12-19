import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import * as CartActions from './cart.actions';
import { ToastService } from '../../services/toast.service';

@Injectable()
export class CartEffects implements OnInitEffects {
  private actions$ = inject(Actions);
  private toast = inject(ToastService);
  
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      map(() => {
        const cart = localStorage.getItem('cart') || '[]';
        return CartActions.cartLoaded({ cart });
      }),
    ),
  );

  promoFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.applyPromoCodeFailure),
      tap(({ error }) => {
        this.toast.error(error || 'Code promo invalide');
      })
    ),
    { dispatch: false }
  );

  stockFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.validateStockFailure),
      tap(({ error, productName }) => {
        this.toast.error(`Stock insuffisant pour ${productName || 'ce produit'}`);
      })
    ),
    { dispatch: false }
  );

  ngrxOnInitEffects(): Action {
    return CartActions.loadCart();
  }
}
