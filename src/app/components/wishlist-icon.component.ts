import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectWishlistCount } from '../state/wishlist/wishlist.selectors';

@Component({
  selector: 'app-wishlist-icon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a
      routerLink="/wishlist"
      class="relative inline-flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 transition"
      aria-label="Ma wishlist"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      @if ((count$ | async) ?? 0; as count) {
        @if (count > 0) {
          <span
            class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full"
          >
            {{ count }}
          </span>
        }
      }
    </a>
  `,
})
export class WishlistIconComponent {
  count$: Observable<number>;

  constructor(private store: Store) {
    this.count$ = this.store.select(selectWishlistCount);
  }
}
