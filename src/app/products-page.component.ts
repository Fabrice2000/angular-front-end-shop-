import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsListComponent } from './components/products-list.component';
import * as ProductsActions from './state/products/products.actions';
import { selectProductsWithRatings, selectProductsLoading } from './state/products/products.selectors';
import { products as mockProducts } from '../mocks/data';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-products-page',
  imports: [CommonModule, FormsModule, ProductsListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <!-- En-tête -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Nos Produits</h1>
        <p class="text-gray-600">Découvrez notre sélection de 20 articles de papeterie</p>
      </div>
      
      <!-- Filtres -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Filtres</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Recherche par nom -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange()"
              placeholder="Nom du produit..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <!-- Filtre par catégorie -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              [(ngModel)]="selectedCategory"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les catégories</option>
              @for (cat of categories(); track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>
          
          <!-- Filtre par prix -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Prix maximum</label>
            <div class="flex items-center gap-2">
              <input
                type="range"
                [(ngModel)]="maxPrice"
                (ngModelChange)="onFilterChange()"
                min="0"
                max="100"
                step="1"
                class="flex-1"
              />
              <span class="text-sm font-medium text-gray-700 w-16">{{ maxPrice() }}€</span>
            </div>
          </div>
          
          <!-- Filtre par note -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Note minimum</label>
            <select
              [(ngModel)]="minRating"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="0">Toutes les notes</option>
              <option value="4">⭐ 4+ étoiles</option>
              <option value="3">⭐ 3+ étoiles</option>
              <option value="2">⭐ 2+ étoiles</option>
            </select>
          </div>
        </div>
        
        <!-- Options supplémentaires -->
        <div class="mt-4 flex flex-wrap gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="showInStockOnly"
              (ngModelChange)="onFilterChange()"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">En stock uniquement</span>
          </label>
          
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="showLowStockOnly"
              (ngModelChange)="onFilterChange()"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Stock faible uniquement</span>
          </label>
          
          <button
            (click)="resetFilters()"
            class="ml-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Réinitialiser
          </button>
        </div>
        
        <!-- Compteur de résultats -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-gray-900">{{ filteredProducts().length }}</span> 
            produit(s) trouvé(s)
          </p>
        </div>
      </div>
      
      <!-- Debug info -->
      <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p class="text-sm text-gray-700">
          <strong>Debug:</strong> 
          Tous les produits: {{ allProducts().length }} | 
          Produits filtrés: {{ filteredProducts().length }}
        </p>
      </div>
      
      <!-- Liste des produits -->
      <app-products-list [products]="filteredProducts()"></app-products-list>
      
      <!-- Message si aucun produit après filtrage -->
      @if (filteredProducts().length === 0 && allProducts().length > 0 && !loading()) {
        <div class="text-center py-12">
          <p class="text-gray-600 text-lg">Aucun produit ne correspond à vos critères</p>
          <button
            (click)="resetFilters()"
            class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      }
      
      <!-- Message de chargement -->
      @if (loading() && allProducts().length === 0) {
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Chargement des produits...</p>
        </div>
      }
    </div>
  `,
})
export class ProductsPageComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private filterChanges$ = new Subject<void>();
  
  // Signals pour les filtres
  searchTerm = signal('');
  selectedCategory = signal('');
  maxPrice = signal(100);
  minRating = signal(0);
  showInStockOnly = signal(false);
  showLowStockOnly = signal(false);
  
  // Données - Directement avec les produits mockés pour affichage immédiat
  allProducts = signal(mockProducts.map(p => ({
    ...p,
    avgRating: p.ratings?.length ? p.ratings.reduce((sum, r) => sum + r.value, 0) / p.ratings.length : 0
  })));
  
  loading = signal(false);
  
  // Catégories uniques
  categories = computed(() => {
    const cats = new Set(this.allProducts().map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  });
  
  // Produits filtrés
  filteredProducts = computed(() => {
    let products = this.allProducts();
    
    // Filtre par recherche
    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }
    
    // Filtre par catégorie
    if (this.selectedCategory()) {
      products = products.filter(p => p.category === this.selectedCategory());
    }
    
    // Filtre par prix
    products = products.filter(p => p.price <= this.maxPrice());
    
    // Filtre par note
    if (this.minRating() > 0) {
      products = products.filter(p => (p.avgRating || 0) >= this.minRating());
    }
    
    // Filtre en stock
    if (this.showInStockOnly()) {
      products = products.filter(p => (p.stock || 0) > 0);
    }
    
    // Filtre stock faible
    if (this.showLowStockOnly()) {
      products = products.filter(p => 
        p.stock !== undefined && 
        p.lowStockThreshold !== undefined && 
        p.stock <= p.lowStockThreshold &&
        p.stock > 0
      );
    }
    
    return products;
  });

  ngOnInit(): void {
    // Restaurer l'état des filtres depuis les query params
    const params = this.route.snapshot.queryParams;
    if (params['q']) { this.searchTerm.set(params['q']); }
    if (params['cat']) { this.selectedCategory.set(params['cat']); }
    if (params['maxPrice']) { this.maxPrice.set(Number(params['maxPrice'])); }
    if (params['minRating']) { this.minRating.set(Number(params['minRating'])); }
    if (params['inStock']) { this.showInStockOnly.set(params['inStock'] === '1'); }
    if (params['lowStock']) { this.showLowStockOnly.set(params['lowStock'] === '1'); }

    // Debounce des modifications de filtres et synchronisation URL
    this.filterChanges$.pipe(debounceTime(350)).subscribe(() => {
      const qp: any = {};
      if (this.searchTerm()) qp.q = this.searchTerm();
      if (this.selectedCategory()) qp.cat = this.selectedCategory();
      if (this.maxPrice() !== undefined) qp.maxPrice = String(this.maxPrice());
      if (this.minRating() > 0) qp.minRating = String(this.minRating());
      if (this.showInStockOnly()) qp.inStock = '1';
      if (this.showLowStockOnly()) qp.lowStock = '1';

      this.router.navigate([], { relativeTo: this.route, queryParams: qp, replaceUrl: true });
    });
  }
  
  onSearchChange(): void {
    this.filterChanges$.next();
  }
  
  onFilterChange(): void {
    this.filterChanges$.next();
  }
  
  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.maxPrice.set(100);
    this.minRating.set(0);
    this.showInStockOnly.set(false);
    this.showLowStockOnly.set(false);
  }
}
