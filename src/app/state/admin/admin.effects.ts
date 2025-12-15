import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as AdminActions from './admin.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class AdminEffects {
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);

  loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminStats),
      mergeMap(() =>
        this.api.getAdminStats().pipe(
          map((stats) => AdminActions.loadAdminStatsSuccess({ stats })),
          catchError((error) => of(AdminActions.loadAdminStatsFailure({ error })))
        )
      )
    )
  );
}
