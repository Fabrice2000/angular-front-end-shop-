import { Routes } from '@angular/router';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'summary',
    pathMatch: 'full',
  },
  {
    path: 'summary',
    loadComponent: () =>
      import('../shop/checkout/step1-summary.component').then(
        (m) => m.Step1SummaryComponent
      ),
  },
  {
    path: 'address',
    loadComponent: () =>
      import('../shop/checkout/step2-address.component').then(
        (m) => m.Step2AddressComponent
      ),
  },
  {
    path: 'confirm',
    loadComponent: () =>
      import('../shop/checkout/step3-confirm.component').then(
        (m) => m.Step3ConfirmComponent
      ),
  },
];
