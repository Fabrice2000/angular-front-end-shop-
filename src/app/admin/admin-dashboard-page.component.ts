import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AdminActions from '../state/admin/admin.actions';
import {
  selectAdminStats,
  selectAdminLoading,
  selectTotalRevenue,
  selectTotalOrders,
  selectTopProducts,
  selectRevenueByMonth,
} from '../state/admin/admin.selectors';
import { AdminStats } from '../state/admin/admin.actions';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p class="text-gray-600 mt-2">Vue d'ensemble des statistiques de la boutique</p>
        </div>

        @if (loading$ | async) {
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Chargement des statistiques...</span>
          </div>
        } @else if (stats$ | async; as stats) {
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Revenue -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                  <p class="text-2xl font-bold text-gray-900 mt-2">
                    {{ stats.totalRevenue | number:'1.2-2' }} €
                  </p>
                </div>
                <div class="bg-green-100 rounded-full p-3">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Total Orders -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Commandes</p>
                  <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalOrders }}</p>
                </div>
                <div class="bg-blue-100 rounded-full p-3">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Total Products -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Produits</p>
                  <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalProducts }}</p>
                </div>
                <div class="bg-purple-100 rounded-full p-3">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Total Customers -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Clients</p>
                  <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalCustomers }}</p>
                </div>
                <div class="bg-yellow-100 rounded-full p-3">
                  <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Top Products -->
            <div class="bg-white rounded-lg shadow">
              <div class="p-6 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">Produits les plus vendus</h2>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  @for (product of stats.topProducts; track product.id) {
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div class="flex-1">
                        <h3 class="font-medium text-gray-900">{{ product.name }}</h3>
                        <p class="text-sm text-gray-600">{{ product.sales }} ventes</p>
                      </div>
                      <div class="text-right">
                        <p class="font-semibold text-green-600">{{ product.revenue | number:'1.2-2' }} €</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Recent Orders -->
            <div class="bg-white rounded-lg shadow">
              <div class="p-6 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">Commandes récentes</h2>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  @for (order of stats.recentOrders; track order.id) {
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div class="flex-1">
                        <h3 class="font-medium text-gray-900">{{ order.customerName }}</h3>
                        <p class="text-sm text-gray-600">
                          {{ order.date | date:'dd/MM/yyyy HH:mm' }}
                        </p>
                      </div>
                      <div class="text-right">
                        <p class="font-semibold text-gray-900">{{ order.total | number:'1.2-2' }} €</p>
                        <span 
                          [class]="getStatusClass(order.status)"
                          class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                        >
                          {{ order.status }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue Chart (Simple Bar Chart) -->
          <div class="bg-white rounded-lg shadow mt-8">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Chiffre d'affaires par mois</h2>
            </div>
            <div class="p-6">
              <div class="flex items-end justify-between h-64 gap-4">
                @for (month of stats.revenueByMonth; track month.month) {
                  <div class="flex flex-col items-center flex-1">
                    <div 
                      class="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors"
                      [style.height.%]="(month.revenue / getMaxRevenue(stats.revenueByMonth)) * 100"
                    ></div>
                    <p class="text-xs text-gray-600 mt-2 font-medium">{{ month.month }}</p>
                    <p class="text-xs text-gray-500">{{ month.revenue | number:'1.0-0' }}€</p>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminDashboardPageComponent implements OnInit {
  stats$!: Observable<AdminStats | null>;
  loading$!: Observable<boolean>;
  totalRevenue$!: Observable<number>;
  totalOrders$!: Observable<number>;
  topProducts$!: Observable<any[]>;
  revenueByMonth$!: Observable<any[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.stats$ = this.store.select(selectAdminStats);
    this.loading$ = this.store.select(selectAdminLoading);
    this.totalRevenue$ = this.store.select(selectTotalRevenue);
    this.totalOrders$ = this.store.select(selectTotalOrders);
    this.topProducts$ = this.store.select(selectTopProducts);
    this.revenueByMonth$ = this.store.select(selectRevenueByMonth);

    this.store.dispatch(AdminActions.loadAdminStats());
  }

  getStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'livrée': 'bg-green-100 text-green-800',
      'expédiée': 'bg-blue-100 text-blue-800',
      'en cours': 'bg-yellow-100 text-yellow-800',
      'annulée': 'bg-red-100 text-red-800',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getMaxRevenue(months: Array<{ month: string; revenue: number }>): number {
    return Math.max(...months.map(m => m.revenue), 1);
  }
}
