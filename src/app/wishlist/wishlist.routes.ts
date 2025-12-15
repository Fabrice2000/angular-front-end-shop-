import { Routes } from '@angular/router';

export const WISHLIST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./wishlist-page.component').then((m) => m.WishlistPageComponent),
  },
];
