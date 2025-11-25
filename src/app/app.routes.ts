import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { AppPlaceholderComponent } from './app-placeholder.component';
import { LoginPageComponent } from './login-page.component';
import { ProductsPageComponent } from './products-page.component';
import { ProductRatingPageComponent } from './product-rating-page.component';
import { ProductDetailsPageComponent } from './shop/product-details/product-details-page.component';
import { CartPageComponent } from './shop/cart/cart-page.component';
import { Step1SummaryComponent } from './shop/checkout/step1-summary.component';
import { Step2AddressComponent } from './shop/checkout/step2-address.component';
import { Step3ConfirmComponent } from './shop/checkout/step3-confirm.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  { path: 'app', component: AppPlaceholderComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'shop/products', component: ProductsPageComponent },
  { path: 'shop/products/:id', component: ProductDetailsPageComponent },
  { path: 'shop/rating', component: ProductRatingPageComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: Step1SummaryComponent },
  { path: 'checkout/address', component: Step2AddressComponent },
  { path: 'checkout/confirm', component: Step3ConfirmComponent },
  { path: '**', redirectTo: '' },
];
