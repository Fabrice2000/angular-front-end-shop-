import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UserActions from './user.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);
  
  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserProfile),
      mergeMap(() =>
        this.api.getUserProfile().pipe(
          map((profile) => UserActions.loadUserProfileSuccess({ profile })),
          catchError((error) => of(UserActions.loadUserProfileFailure({ error })))
        )
      )
    )
  );

  updateUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserProfile),
      mergeMap(({ updates }) =>
        this.api.updateUserProfile(updates).pipe(
          map((profile) => UserActions.updateUserProfileSuccess({ profile })),
          catchError((error) => of(UserActions.updateUserProfileFailure({ error })))
        )
      )
    )
  );

  loadUserOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserOrders),
      mergeMap(() =>
        this.api.getUserOrders().pipe(
          map((orders) => UserActions.loadUserOrdersSuccess({ orders })),
          catchError((error) => of(UserActions.loadUserOrdersFailure({ error })))
        )
      )
    )
  );

  loadOrderDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadOrderDetails),
      mergeMap(({ orderId }) =>
        this.api.getOrderDetails(orderId).pipe(
          map((order) => UserActions.loadOrderDetailsSuccess({ order })),
          catchError((error) => of(UserActions.loadOrderDetailsFailure({ error })))
        )
      )
    )
  );
}
