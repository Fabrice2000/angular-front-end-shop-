import { Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../shop/cart/cart-page.component').then((m) => m.CartPageComponent),
  },
];
