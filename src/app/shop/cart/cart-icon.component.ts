import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartCount } from '../../state/cart/cart.selectors';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a
      routerLink="/cart"
      class="relative inline-flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title="Voir le panier"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      @if (cartCount$ | async; as count) {
        @if (count > 0) {
          <span
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          >
            {{ count > 99 ? '99+' : count }}
          </span>
        }
      }
    </a>
  `,
  styles: [],
})
export class CartIconComponent {
  private store = inject(Store);
  cartCount$ = this.store.select(selectCartCount);
}
