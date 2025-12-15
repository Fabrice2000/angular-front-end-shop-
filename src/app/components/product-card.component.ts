import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as CartActions from '../state/cart/cart.actions';
import { ToastService } from '../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <!-- Image du produit -->
      <div class="relative h-48 bg-gray-200 overflow-hidden">
        @if (image) {
          <img 
            [src]="image" 
            [alt]="name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        } @else {
          <div class="flex items-center justify-center h-full text-gray-400">
            <span class="text-4xl">?</span>
          </div>
        }
        
        <!-- Badge catégorie -->
        @if (category) {
          <span class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {{ category }}
          </span>
        }
        
        <!-- Badge stock -->
        @if (stock !== undefined) {
          @if (stock === 0) {
            <span class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              Rupture
            </span>
          } @else if (lowStockThreshold !== undefined && stock <= lowStockThreshold) {
            <span class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Stock faible
            </span>
          }
        }
      </div>
      
      <!-- Contenu -->
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {{ name }}
        </h3>
        
        @if (description) {
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">
            {{ description }}
          </p>
        }
        
        <!-- Prix et notation -->
        <div class="flex items-center justify-between mb-3">
          <span class="text-2xl font-bold text-blue-600">
            {{ price | currency:'EUR':'symbol':'1.2-2':'fr' }}
          </span>
          
          @if (avgRating) {
            <div class="flex items-center gap-1">
              <span class="text-yellow-500">⭐</span>
              <span class="text-sm font-medium text-gray-700">
                {{ avgRating | number:'1.1-1' }}
              </span>
            </div>
          }
        </div>
        
        <!-- Stock info -->
        @if (stock !== undefined) {
          <p class="text-xs text-gray-500 mb-3">
            Stock : {{ stock }} unité(s)
          </p>
        }
        
        <!-- Boutons -->
        <div class="flex gap-2">
          @if (stock === undefined || stock > 0) {
            <button
              (click)="addToCart()"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>Ajouter</span>
            </button>
          } @else {
            <button
              disabled
              class="flex-1 bg-gray-400 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Rupture
            </button>
          }
          
          <a 
            [routerLink]="['/shop/products', id]"
            class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Détails
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductCardComponent {
  private store = inject(Store);
  private toast = inject(ToastService);
  
  @Input() id = 0;
  @Input() name = '';
  @Input() price = 0;
  @Input() created_at?: string;
  @Input() ratings?: any[];
  @Input() avgRating?: number;
  @Input() image?: string;
  @Input() category?: string;
  @Input() description?: string;
  @Input() stock?: number;
  @Input() lowStockThreshold?: number;
  
  addToCart(): void {
    if (this.stock === 0) {
      this.toast.error('Produit en rupture de stock');
      return;
    }
    
    // Créer l'objet produit complet
    const product = {
      id: this.id,
      name: this.name,
      price: this.price,
      created_at: this.created_at || '',
      owner_id: 0,
      ratings: this.ratings || [],
      stock: this.stock,
      lowStockThreshold: this.lowStockThreshold,
      image: this.image,
      category: this.category,
      description: this.description,
    };
    
    this.store.dispatch(CartActions.addItem({ product, quantity: 1 }));
    this.toast.success(`${this.name} ajouté au panier !`);
  }
}
