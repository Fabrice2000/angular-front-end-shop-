import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as CartActions from './cart.actions';

@Injectable()
export class CartEffects implements OnInitEffects {
  private actions$ = inject(Actions);
  
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      map(() => {
        const cart = localStorage.getItem('cart') || '[]';
        return CartActions.cartLoaded({ cart });
      }),
    ),
  );

  ngrxOnInitEffects(): Action {
    return CartActions.loadCart();
  }
}
