import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed } from '@angular/core';
import { selectCartItems } from '../state/cart/cart.selectors';

@Component({
  standalone: true,
  selector: 'app-cart-badge',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a 
      routerLink="/cart" 
      class="relative text-gray-700 hover:text-blue-600 transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      @if (itemCount() > 0) {
        <span 
          class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ itemCount() }}
        </span>
      }
      <span class="ml-1">Panier</span>
    </a>
  `,
})
export class CartBadgeComponent {
  private store = inject(Store);
  
  private cartItems = toSignal(this.store.select(selectCartItems), { initialValue: [] });
  
  itemCount = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });
}
