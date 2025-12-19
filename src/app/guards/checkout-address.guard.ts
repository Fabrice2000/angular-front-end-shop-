import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Guard simple qui vérifie la présence d'une adresse de livraison.
// Lecture prioritaire dans localStorage (clé 'checkout_address').
export const checkoutAddressGuard: CanActivateFn = () => {
  const router = inject(Router);
  // fallback : lire dans localStorage
  const addr = localStorage.getItem('checkout_address');
  if (!addr) {
    router.navigate(['/checkout/step2']);
    return false;
  }
  return true;
};
