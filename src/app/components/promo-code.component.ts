import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as CartActions from '../state/cart/cart.actions';
import {
  selectCartTotalPrice,
  selectCartDiscount,
  selectCartShipping,
  selectCartTaxes,
  selectCartGrandTotal,
  selectCartAppliedPromos,
} from '../state/cart/cart.selectors';

@Component({
  selector: 'app-promo-code',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="promo-code-section bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold mb-4">Code promo</h3>

      @if ((appliedPromos$ | async)?.length ?? 0; as promosCount) {
        @if (promosCount > 0) {
          <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div class="flex items-center justify-between">
              <span class="text-green-800 font-medium">
                ✓ Code appliqué: {{ (appliedPromos$ | async)?.[0] }}
              </span>
              <button
                (click)="removePromo()"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Retirer
              </button>
            </div>
          </div>
        }
      }

      <div class="flex gap-2 mb-4">
        <input
          type="text"
          [(ngModel)]="promoCode"
          placeholder="Entrez votre code promo"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [disabled]="((appliedPromos$ | async)?.length ?? 0) > 0"
        />
        <button
          (click)="applyPromo()"
          [disabled]="!promoCode || ((appliedPromos$ | async)?.length ?? 0) > 0"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Appliquer
        </button>
      </div>

      <!-- Price Summary -->
      <div class="space-y-2 border-t pt-4">
        <div class="flex justify-between text-gray-700">
          <span>Sous-total</span>
          <span>{{ (totalPrice$ | async)?.toFixed(2) }} €</span>
        </div>

        @if ((discount$ | async) ?? 0; as discount) {
          @if (discount > 0) {
            <div class="flex justify-between text-green-600 font-medium">
              <span>Remise</span>
              <span>- {{ discount.toFixed(2) }} €</span>
            </div>
          }
        }

        <div class="flex justify-between text-gray-700">
          <span>Frais de port</span>
          <span>
            @if ((shipping$ | async) ?? 0; as shipping) {
              {{ shipping === 0 ? 'GRATUIT' : shipping.toFixed(2) + ' €' }}
            }
          </span>
        </div>

        <div class="flex justify-between text-gray-700">
          <span>Taxes (TVA 20%)</span>
          <span>{{ (taxes$ | async)?.toFixed(2) }} €</span>
        </div>

        <div class="flex justify-between text-xl font-bold text-gray-900 border-t pt-2 mt-2">
          <span>Total</span>
          <span class="text-blue-600">{{ (grandTotal$ | async)?.toFixed(2) }} €</span>
        </div>
      </div>

      <!-- Promo codes info -->
      <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
        <p class="font-semibold text-blue-800 mb-1">Codes disponibles :</p>
        <ul class="text-blue-700 space-y-1">
          <li>• <strong>WELCOME10</strong> : -10% sur votre commande</li>
          <li>• <strong>FREESHIP</strong> : Livraison gratuite</li>
          <li>• <strong>VIP20</strong> : -20% (minimum 50€)</li>
        </ul>
      </div>
    </div>
  `,
})
export class PromoCodeComponent {
  promoCode = '';

  totalPrice$: Observable<number>;
  discount$: Observable<number>;
  shipping$: Observable<number>;
  taxes$: Observable<number>;
  grandTotal$: Observable<number>;
  appliedPromos$: Observable<string[]>;

  constructor(private store: Store) {
    this.totalPrice$ = this.store.select(selectCartTotalPrice);
    this.discount$ = this.store.select(selectCartDiscount);
    this.shipping$ = this.store.select(selectCartShipping);
    this.taxes$ = this.store.select(selectCartTaxes);
    this.grandTotal$ = this.store.select(selectCartGrandTotal);
    this.appliedPromos$ = this.store.select(selectCartAppliedPromos);
  }

  applyPromo() {
    if (this.promoCode.trim()) {
      this.store.dispatch(CartActions.applyPromoCode({ code: this.promoCode.trim() }));
    }
  }

  removePromo() {
    this.store.dispatch(CartActions.removePromoCode());
    this.promoCode = '';
  }
}
