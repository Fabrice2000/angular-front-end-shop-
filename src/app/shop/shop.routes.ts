import { Routes } from '@angular/router';

export const SHOP_ROUTES: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('../products-page.component').then((m) => m.ProductsPageComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./product-details/product-details-page.component').then(
        (m) => m.ProductDetailsPageComponent
      ),
  },
  {
    path: 'rating',
    loadComponent: () =>
      import('../product-rating-page.component').then(
        (m) => m.ProductRatingPageComponent
      ),
  },
];
