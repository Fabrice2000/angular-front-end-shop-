import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as UserActions from '../state/user/user.actions';
import { OrderSummary } from '../state/user/user.actions';
import { selectUserOrders, selectUserLoading } from '../state/user/user.selectors';

@Component({
  selector: 'app-account-orders-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Mes Commandes</h1>

      @if (loading$ | async) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (orders$ | async; as orders) {
        @if (orders.length === 0) {
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p class="text-gray-600 mb-4">Vous n'avez pas encore passé de commande.</p>
            <a
              routerLink="/shop/products"
              class="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Découvrir nos produits
            </a>
          </div>
        } @else {
          <div class="space-y-4">
            @for (order of orders; track order.id) {
              <div
                class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
                [routerLink]="['/account/orders', order.id]"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold">Commande #{{ order.id }}</h3>
                      <span
                        class="px-3 py-1 rounded-full text-sm font-medium"
                        [class]="getStatusClass(order.status)"
                      >
                        {{ order.status }}
                      </span>
                    </div>
                    <p class="text-gray-600 text-sm mb-1">
                      {{ order.itemCount }} article(s)
                    </p>
                    <p class="text-gray-500 text-sm">
                      {{ formatDate(order.createdAt) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-blue-600">{{ order.total.toFixed(2) }} €</p>
                    <button
                      class="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      [routerLink]="['/account/orders', order.id]"
                    >
                      Voir les détails →
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
})
export class AccountOrdersPageComponent implements OnInit {
  orders$: Observable<OrderSummary[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.orders$ = this.store.select(selectUserOrders);
    this.loading$ = this.store.select(selectUserLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserOrders());
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
    });
  }
}
