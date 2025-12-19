import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, Subject, of } from 'rxjs';
import { ProductsEffects } from './products.effects';
import * as ProductsActions from './products.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { products } from '../../../mocks/data';

describe('ProductsEffects', () => {
  let actions$: Subject<any>;
  let effects: ProductsEffects;
  let apiSpy: any;

  beforeEach(() => {
    actions$ = new Subject();
    apiSpy = { getProducts: jasmine.createSpy('getProducts') };

    TestBed.configureTestingModule({
      providers: [
        ProductsEffects,
        provideMockActions(() => actions$ as Observable<any>),
        { provide: ShopApiService, useValue: apiSpy },
      ],
    });

    effects = TestBed.inject(ProductsEffects);
  });

  it('should dispatch loadProductsSuccess on successful API call', (done) => {
    const resp = { count: 1, results: [products[0]] };
    apiSpy.getProducts.and.returnValue(of(resp));

    effects.loadProducts$.subscribe((action) => {
      try {
        expect(action.type).toBe(ProductsActions.loadProductsSuccess.type);
        done();
      } catch (err: any) {
        done.fail(err);
      }
    });

    actions$.next(ProductsActions.loadProducts({ page_size: 20 }));
  });

  it('should dispatch loadProductsFailure on API error', (done) => {
    const error = new Error('Network');
    apiSpy.getProducts.and.returnValue(new Observable((observer) => observer.error(error)));

    effects.loadProducts$.subscribe((action) => {
      try {
        expect(action.type).toBe(ProductsActions.loadProductsFailure.type);
        done();
      } catch (err: any) {
        done.fail(err);
      }
    });

    actions$.next(ProductsActions.loadProducts({ page_size: 20 }));
  });
});
