import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { ToastService } from '../../services/toast.service';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);
  private toast = inject(ToastService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.api.login(username, password).pipe(
          map((res) => AuthActions.loginSuccess({ access: res.access, refresh: res.refresh })),
          catchError((error) => {
            this.toast.error('Échec de la connexion. Vérifiez vos identifiants.');
            return of(AuthActions.loginFailure({ error }));
          })
        )
      )
    )
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      mergeMap(({ refresh }) =>
        this.api.refresh(refresh).pipe(
          map((res) => AuthActions.refreshSuccess({ access: res.access })),
          catchError((error) => of(AuthActions.refreshFailure({ error })))
        )
      )
    )
  );
}
