import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authReducer } from './state/auth/auth.reducer';
import { productsReducer } from './state/products/products.reducer';
import { cartReducer } from './state/cart/cart.reducer';
import { userReducer } from './state/user/user.reducer';
import { wishlistReducer } from './state/wishlist/wishlist.reducer';
import { reviewsReducer } from './state/reviews/reviews.reducer';
import { adminReducer } from './state/admin/admin.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { ProductsEffects } from './state/products/products.effects';
import { CartEffects } from './state/cart/cart.effects';
import { UserEffects } from './state/user/user.effects';
import { WishlistEffects } from './state/wishlist/wishlist.effects';
import { ReviewsEffects } from './state/reviews/reviews.effects';
import { AdminEffects } from './state/admin/admin.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    provideStore({
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      user: userReducer,
      wishlist: wishlistReducer,
      reviews: reviewsReducer,
      admin: adminReducer,
    }),
    provideEffects([AuthEffects, ProductsEffects, CartEffects, UserEffects, WishlistEffects, ReviewsEffects, AdminEffects]),
    provideStoreDevtools({ maxAge: 25 }),
  ],
};
