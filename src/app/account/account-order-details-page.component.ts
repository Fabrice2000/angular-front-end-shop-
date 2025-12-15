import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as UserActions from '../state/user/user.actions';
import { OrderDetails } from '../state/user/user.actions';
import { selectSelectedOrder, selectUserLoading } from '../state/user/user.selectors';

@Component({
  selector: 'app-account-order-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a
          routerLink="/account/orders"
          class="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Retour à mes commandes
        </a>
      </div>

      @if (loading$ | async) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (order$ | async; as order) {
        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="border-b pb-4 mb-4">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl font-bold mb-2">Commande #{{ order.id }}</h1>
                <p class="text-gray-600">
                  Passée le {{ formatDate(order.createdAt) }}
                </p>
              </div>
              <span
                class="px-4 py-2 rounded-full text-sm font-medium"
                [class]="getStatusClass(order.status)"
              >
                {{ order.status }}
              </span>
            </div>
          </div>

          <!-- Items List -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-4">Articles commandés</h2>
            <div class="space-y-3">
              @for (item of order.items; track item.productId) {
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div class="flex-1">
                    <p class="font-medium">{{ item.productName }}</p>
                    <p class="text-sm text-gray-600">Quantité: {{ item.quantity }}</p>
                  </div>
                  <p class="font-semibold text-gray-800">
                    {{ (item.price * item.quantity).toFixed(2) }} €
                  </p>
                </div>
              }
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-3">Adresse de livraison</h2>
            <div class="bg-gray-50 p-4 rounded-md">
              <p>{{ order.shippingAddress.street }}</p>
              <p>
                {{ order.shippingAddress.postalCode }} {{ order.shippingAddress.city }}
              </p>
              <p>{{ order.shippingAddress.country }}</p>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="border-t pt-4">
            <h2 class="text-xl font-semibold mb-3">Récapitulatif</h2>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Sous-total</span>
                <span>{{ order.subtotal.toFixed(2) }} €</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Frais de livraison</span>
                <span>{{ order.shipping.toFixed(2) }} €</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Taxes</span>
                <span>{{ order.taxes.toFixed(2) }} €</span>
              </div>
              <div class="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span class="text-blue-600">{{ order.total.toFixed(2) }} €</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AccountOrderDetailsPageComponent implements OnInit {
  order$: Observable<OrderDetails | null>;
  loading$: Observable<boolean>;
  orderId: string = '';

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.order$ = this.store.select(selectSelectedOrder);
    this.loading$ = this.store.select(selectUserLoading);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.orderId = params['id'];
      this.store.dispatch(UserActions.loadOrderDetails({ orderId: this.orderId }));
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'livrée':
        return 'bg-green-100 text-green-800';
      case 'expédiée':
        return 'bg-blue-100 text-blue-800';
      case 'en cours':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
