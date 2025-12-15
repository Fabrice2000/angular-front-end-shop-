import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./account-profile-page.component').then(
        (m) => m.AccountProfilePageComponent
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./account-orders-page.component').then(
        (m) => m.AccountOrdersPageComponent
      ),
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./account-order-details-page.component').then(
        (m) => m.AccountOrderDetailsPageComponent
      ),
  },
];
