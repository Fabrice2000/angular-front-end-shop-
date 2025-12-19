import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectCartItems } from '../state/cart/cart.selectors';

export const checkoutCartGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store);
  const items = toSignal(store.select(selectCartItems), { initialValue: [] });
  if (!items() || items().length === 0) {
    router.navigate(['/cart']);
    return false;
  }
  return true;
};
