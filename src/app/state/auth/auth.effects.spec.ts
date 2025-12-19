import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, Subject, of } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { ShopApiService } from '../../services/shop-api.service';
import * as AuthActions from './auth.actions';

describe('AuthEffects', () => {
  let actions$: Subject<any>;
  let effects: AuthEffects;
  let apiSpy: any;

  beforeEach(() => {
    actions$ = new Subject();
    apiSpy = { login: jasmine.createSpy('login') };

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$ as Observable<any>),
        { provide: ShopApiService, useValue: apiSpy },
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  it('should dispatch loginSuccess on successful login', (done) => {
    const tokens = { access: 'abc123', refresh: 'def456' };
    apiSpy.login.and.returnValue(of(tokens));

    effects.login$.subscribe((action) => {
      try {
        expect(action.type).toBe(AuthActions.loginSuccess.type);
        done();
      } catch (err: any) {
        done.fail(err);
      }
    });

    actions$.next(AuthActions.login({ username: 'test', password: 'pass' }));
  });

  it('should dispatch loginFailure on login error', (done) => {
    const error = new Error('Invalid credentials');
    apiSpy.login.and.returnValue(new Observable((observer) => observer.error(error)));

    effects.login$.subscribe((action) => {
      try {
        expect(action.type).toBe(AuthActions.loginFailure.type);
        done();
      } catch (err: any) {
        done.fail(err);
      }
    });

    actions$.next(AuthActions.login({ username: 'wrong', password: 'bad' }));
  });
});
