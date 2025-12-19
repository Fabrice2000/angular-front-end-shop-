import { TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastService } from '../services/toast.service';
import { products } from '../../mocks/data';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

describe('ProductCardComponent', () => {
  let storeSpy: any;
  let toastSpy: any;

  beforeEach(async () => {
    storeSpy = { dispatch: jasmine.createSpy('dispatch') };
    toastSpy = { success: jasmine.createSpy('success'), error: jasmine.createSpy('error') };

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: ToastService, useValue: toastSpy },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should render and dispatch addToCart', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    const comp = fixture.componentInstance;
    comp.id = products[0].id;
    comp.name = products[0].name;
    comp.price = products[0].price;
    comp.stock = 10;
    fixture.detectChanges();

    comp.addToCart();
    expect(storeSpy.dispatch).toHaveBeenCalled();
    expect(toastSpy.success).toHaveBeenCalledWith(`${products[0].name} ajouté au panier !`);
  });

  it('should show error toast on out of stock', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    const comp = fixture.componentInstance;
    comp.stock = 0;
    fixture.detectChanges();

    comp.addToCart();
    expect(toastSpy.error).toHaveBeenCalledWith('Produit en rupture de stock');
  });
});
