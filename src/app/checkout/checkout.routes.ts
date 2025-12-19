import { Routes } from '@angular/router';
import { checkoutCartGuard } from '../guards/checkout-cart.guard';
import { checkoutAddressGuard } from '../guards/checkout-address.guard';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'summary',
    pathMatch: 'full',
  },
  {
    path: 'summary',
    canActivate: [checkoutCartGuard],
    loadComponent: () =>
      import('../shop/checkout/step1-summary.component').then(
        (m) => m.Step1SummaryComponent
      ),
  },
  {
    path: 'address',
    canActivate: [checkoutCartGuard],
    loadComponent: () =>
      import('../shop/checkout/step2-address.component').then(
        (m) => m.Step2AddressComponent
      ),
  },
  {
    path: 'confirm',
    canActivate: [checkoutCartGuard, checkoutAddressGuard],
    loadComponent: () =>
      import('../shop/checkout/step3-confirm.component').then(
        (m) => m.Step3ConfirmComponent
      ),
  },
];
