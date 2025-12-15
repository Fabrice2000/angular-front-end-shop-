import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/shop/products', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  
  // Shop Module (Lazy Loaded)
  {
    path: 'shop',
    loadChildren: () =>
      import('./shop/shop.routes').then((m) => m.SHOP_ROUTES),
  },
  
  // Account Module (Lazy Loaded)
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.routes').then((m) => m.ACCOUNT_ROUTES),
  },
  
  // Wishlist Module (Lazy Loaded)
  {
    path: 'wishlist',
    loadChildren: () =>
      import('./wishlist/wishlist.routes').then((m) => m.WISHLIST_ROUTES),
  },
  
  // Admin Module (Lazy Loaded)
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  
  // Cart Module (Lazy Loaded)
  {
    path: 'cart',
    loadChildren: () =>
      import('./cart/cart.routes').then((m) => m.CART_ROUTES),
  },
  
  // Checkout Module (Lazy Loaded)
  {
    path: 'checkout',
    loadChildren: () =>
      import('./checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
  },
  
  { path: '**', redirectTo: '' },
];
