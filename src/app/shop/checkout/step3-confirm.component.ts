import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartFinalTotal,
} from '../../state/cart/cart.selectors';
import { clearCart } from '../../state/cart/cart.actions';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-step3-confirm',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-8">
      @if (!orderConfirmed) {
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Confirmation de la commande</h2>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Adresse de livraison</h3>
            @if (shippingAddress) {
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-medium">
                  {{ shippingAddress.firstName }} {{ shippingAddress.lastName }}
                </p>
                <p class="text-gray-600">{{ shippingAddress.email }}</p>
                <p class="text-gray-600">{{ shippingAddress.phone }}</p>
                <p class="text-gray-600 mt-2">{{ shippingAddress.address }}</p>
                <p class="text-gray-600">
                  {{ shippingAddress.postalCode }} {{ shippingAddress.city }}
                </p>
                <p class="text-gray-600">{{ shippingAddress.country }}</p>
              </div>
            } @else {
              <p class="text-red-600">Aucune adresse de livraison trouvée</p>
            }
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Articles commandés</h3>
            @if (cartItems$ | async; as items) {
              <div class="space-y-3">
                @for (item of items; track item.product.id) {
                  <div class="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                    @if (item.product.image) {
                      <img
                        [src]="item.product.image"
                        [alt]="item.product.name"
                        class="w-12 h-12 object-cover rounded"
                      />
                    }
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">{{ item.product.name }}</p>
                      <p class="text-sm text-gray-500">Quantité: {{ item.quantity }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900">
                        {{ (item.product.price * item.quantity).toFixed(2) }} €
                      </p>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <div class="border-t border-gray-200 pt-4 mb-6">
            <div class="flex justify-between text-xl font-bold text-gray-900">
              <span>Total à payer</span>
              <span>{{ (cartFinalTotal$ | async)?.toFixed(2) }} €</span>
            </div>
          </div>

          @if (error) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {{ error }}
            </div>
          }

          <div class="flex gap-4">
            <button
              type="button"
              (click)="goBack()"
              [disabled]="isProcessing"
              class="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Modifier l'adresse
            </button>
            <button
              type="button"
              (click)="confirmOrder()"
              [disabled]="isProcessing || !shippingAddress"
              class="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ isProcessing ? 'Traitement en cours...' : 'Confirmer la commande' }}
            </button>
          </div>
        </div>
      } @else {
        <div class="text-center py-8">
          <div class="mb-6">
            <svg
              class="w-20 h-20 mx-auto text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Commande confirmée avec succès!
          </h2>

          @if (orderDetails) {
            <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 inline-block">
              <p class="text-gray-700 mb-2">Numéro de commande:</p>
              <p class="text-2xl font-bold text-green-600">
                {{ orderDetails.order_number }}
              </p>
              @if (orderDetails.estimated_delivery) {
                <p class="text-sm text-gray-600 mt-3">
                  Livraison estimée: {{ formatDate(orderDetails.estimated_delivery) }}
                </p>
              }
            </div>
          }

          <p class="text-gray-600 mb-6">
            Vous recevrez un email de confirmation à l'adresse indiquée.
          </p>

          <div class="flex gap-4 justify-center">
            <button
              (click)="goToProducts()"
              class="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class Step3ConfirmComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private store = inject(Store);

  cartItems$ = this.store.select(selectCartItems);
  cartFinalTotal$ = this.store.select(selectCartFinalTotal);

  shippingAddress: any = null;
  orderConfirmed = false;
  orderDetails: any = null;
  isProcessing = false;
  error: string | null = null;

  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    // Load shipping address
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      try {
        this.shippingAddress = JSON.parse(savedAddress);
      } catch (e) {
        console.error('Error loading shipping address', e);
        this.error = 'Erreur lors du chargement de l\'adresse';
      }
    } else {
      this.error = 'Aucune adresse de livraison trouvée';
    }
  }

  async confirmOrder(): Promise<void> {
    if (!this.shippingAddress) {
      this.error = 'Veuillez renseigner une adresse de livraison';
      return;
    }

    this.isProcessing = true;
    this.error = null;

    try {
      const items = await firstValueFrom(this.cartItems$);
      const total = await firstValueFrom(this.cartFinalTotal$);

      const orderData = {
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shipping_address: this.shippingAddress,
        total,
      };

      const response = await firstValueFrom(
        this.http.post<any>('/api/order/', orderData),
      );

      this.orderDetails = response;
      this.orderConfirmed = true;

      // Clear cart
      this.store.dispatch(clearCart());
      
      // Clear shipping address
      localStorage.removeItem('shippingAddress');
    } catch (err) {
      console.error('Error confirming order', err);
      this.error = 'Une erreur est survenue lors de la confirmation de la commande';
    } finally {
      this.isProcessing = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/checkout/address']);
  }

  goToProducts(): void {
    this.router.navigate(['/shop/products']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
