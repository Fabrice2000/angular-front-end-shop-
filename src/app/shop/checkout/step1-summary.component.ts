import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartTotal,
  selectCartFinalTotal,
} from '../../state/cart/cart.selectors';

@Component({
  selector: 'app-step1-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Récapitulatif de la commande</h2>

      @if (cartItems$ | async; as items) {
        @if (items.length === 0) {
          <div class="text-center py-8">
            <p class="text-gray-600">Votre panier est vide</p>
            <button
              (click)="router.navigate(['/shop/products'])"
              class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        } @else {
          <div class="space-y-4 mb-6">
            @for (item of items; track item.product.id) {
              <div class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                @if (item.product.image) {
                  <img
                    [src]="item.product.image"
                    [alt]="item.product.name"
                    class="w-16 h-16 object-cover rounded"
                  />
                }
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ item.product.name }}</h3>
                  <p class="text-sm text-gray-500">
                    {{ item.product.price.toFixed(2) }} € × {{ item.quantity }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900">
                    {{ (item.product.price * item.quantity).toFixed(2) }} €
                  </p>
                </div>
              </div>
            }
          </div>

          <div class="border-t border-gray-200 pt-4 space-y-2">
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
              }
            }

            <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>{{ (cartFinalTotal$ | async)?.toFixed(2) }} €</span>
            </div>
          </div>

          <button
            (click)="nextStep()"
            class="w-full mt-6 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuer vers l'adresse de livraison
          </button>
        }
      }
    </div>
  `,
  styles: [],
})
export class Step1SummaryComponent implements OnInit {
  public router = inject(Router);
  private store = inject(Store);

  cartItems$ = this.store.select(selectCartItems);
  cartTotal$ = this.store.select(selectCartTotal);
  cartFinalTotal$ = this.store.select(selectCartFinalTotal);

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  nextStep(): void {
    this.router.navigate(['/checkout/address']);
  }
}
