import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as WishlistActions from '../state/wishlist/wishlist.actions';
import { selectIsInWishlist } from '../state/wishlist/wishlist.selectors';

@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleWishlist()"
      [attr.aria-label]="(isInWishlist$ | async) ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'"
      class="wishlist-btn"
      [class.active]="isInWishlist$ | async"
    >
      @if (isInWishlist$ | async) {
        <svg class="heart-icon filled" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      } @else {
        <svg class="heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      }
    </button>
  `,
  styles: [`
    .wishlist-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #6b7280;
    }

    .wishlist-btn:hover {
      transform: scale(1.1);
      color: #ef4444;
    }

    .wishlist-btn.active {
      color: #ef4444;
      animation: heartBeat 0.5s ease;
    }

    .heart-icon {
      width: 24px;
      height: 24px;
    }

    .heart-icon.filled {
      animation: heartPulse 0.5s ease;
    }

    @keyframes heartBeat {
      0%, 100% {
        transform: scale(1);
      }
      25% {
        transform: scale(1.3);
      }
      50% {
        transform: scale(0.9);
      }
      75% {
        transform: scale(1.1);
      }
    }

    @keyframes heartPulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }
  `],
})
export class WishlistButtonComponent {
  @Input() productId!: string;
  isInWishlist$!: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.isInWishlist$ = this.store.select(selectIsInWishlist(this.productId));
  }

  toggleWishlist() {
    this.store.dispatch(WishlistActions.toggleWishlist({ productId: this.productId }));
  }
}
