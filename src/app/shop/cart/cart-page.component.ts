import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from '../../state/cart/cart.selectors';
import { updateQuantity, removeItem, clearCart } from '../../state/cart/cart.actions';
import { CartItemComponent } from './cart-item.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CartItemComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Mon Panier</h1>
        <p class="text-gray-600 mt-2">
          {{ (cartCount$ | async) || 0 }} article(s) dans votre panier
        </p>
      </div>

      @if (cartItems$ | async; as items) {
        @if (items.length === 0) {
          <div class="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-24 w-24 mx-auto text-gray-300 mb-4"
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
            <h2 class="text-2xl font-semibold text-gray-700 mb-2">
              Votre panier est vide
            </h2>
            <p class="text-gray-500 mb-6">
              Ajoutez des produits à votre panier pour continuer vos achats
            </p>
            <a
              routerLink="/shop/products"
              class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir les produits
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-4">
              @for (item of items; track item.product.id) {
                <app-cart-item
                  [item]="item"
                  (quantityChange)="onQuantityChange(item.product.id, $event)"
                  (removeItem)="onRemoveItem(item.product.id)"
                />
              }

              <div class="flex justify-between items-center pt-4">
                <button
                  (click)="onClearCart()"
                  class="text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Vider le panier
                </button>
                <a
                  routerLink="/shop/products"
                  class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  ← Continuer mes achats
                </a>
              </div>
            </div>

            <div class="lg:col-span-1">
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h2>
                
                <div class="space-y-3 mb-6">
                  <div class="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span class="font-medium">{{ (cartTotal$ | async)?.toFixed(2) }} €</span>
                  </div>
                  
                  @if ((cartTotal$ | async) || 0; as total) {
                    @if (total > 50) {
                      <div class="flex justify-between text-green-600">
                        <span>Réduction (10%)</span>
                        <span class="font-medium">-{{ (total * 0.1).toFixed(2) }} €</span>
                      </div>
                      <div class="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>{{ (total - total * 0.1).toFixed(2) }} €</span>
                      </div>
                    } @else {
                      <div class="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>{{ total.toFixed(2) }} €</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-2">
                        Ajoutez {{ (50 - total).toFixed(2) }} € pour bénéficier de 10% de réduction
                      </p>
                    }
                  }
                </div>

                <button
                  routerLink="/checkout"
                  class="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Passer la commande
                </button>

                <div class="mt-4 space-y-2 text-xs text-gray-500">
                  <p class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Paiement sécurisé
                  </p>
                  <p class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Livraison sous 3-5 jours
                  </p>
                  <p class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Retour gratuit sous 30 jours
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [],
})
export class CartPageComponent implements OnInit {
  private store = inject(Store);
  
  cartItems$ = this.store.select(selectCartItems);
  cartTotal$ = this.store.select(selectCartTotal);
  cartCount$ = this.store.select(selectCartCount);

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  onQuantityChange(productId: number, quantity: number): void {
    this.store.dispatch(updateQuantity({ productId, quantity }));
  }

  onRemoveItem(productId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.store.dispatch(removeItem({ productId }));
    }
  }

  onClearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      this.store.dispatch(clearCart());
    }
  }
}
