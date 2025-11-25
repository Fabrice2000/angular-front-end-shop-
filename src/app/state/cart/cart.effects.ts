import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as CartActions from './cart.actions';

@Injectable()
export class CartEffects implements OnInitEffects {
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      map(() => {
        const cart = localStorage.getItem('cart') || '[]';
        return CartActions.cartLoaded({ cart });
      }),
    ),
  );

  constructor(private actions$: Actions) {}

  ngrxOnInitEffects(): Action {
    return CartActions.loadCart();
  }
}
