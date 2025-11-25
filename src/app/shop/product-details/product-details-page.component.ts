import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable, catchError, of } from 'rxjs';
import { Product } from '../../../mocks/data';
import { addItem } from '../../state/cart/cart.actions';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <div class="mb-6">
        <a
          routerLink="/shop/products"
          class="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour aux produits
        </a>
      </div>

      @if (product$ | async; as product) {
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <!-- Image Section -->
            <div class="flex items-center justify-center bg-gray-50 rounded-lg p-8">
              @if (product.image) {
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  class="w-full h-auto max-h-96 object-contain rounded-lg"
                />
              } @else {
                <div class="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                  <span class="text-gray-400 text-xl">Pas d'image</span>
                </div>
              }
            </div>

            <!-- Product Info Section -->
            <div class="flex flex-col">
              <div class="flex-1">
                @if (product.category) {
                  <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {{ product.category }}
                  </span>
                }
                
                <h1 class="text-3xl font-bold text-gray-900 mb-4">
                  {{ product.name }}
                </h1>

                <div class="flex items-center gap-4 mb-6">
                  <span class="text-4xl font-bold text-green-600">
                    {{ product.price.toFixed(2) }} €
                  </span>
                  
                  @if (product.ratings && product.ratings.length > 0) {
                    <div class="flex items-center">
                      <svg
                        class="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span class="ml-1 text-gray-600">
                        {{ getAverageRating(product) }} ({{ product.ratings.length }})
                      </span>
                    </div>
                  }
                </div>

                @if (product.description) {
                  <div class="mb-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                    <p class="text-gray-600 leading-relaxed">
                      {{ product.description }}
                    </p>
                  </div>
                }

                @if (product.stock !== undefined) {
                  <div class="mb-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-2">Disponibilité</h2>
                    <div class="flex items-center gap-2">
                      @if (product.stock > 0) {
                        <span
                          class="inline-flex items-center gap-2 text-green-600 font-medium"
                        >
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          En stock ({{ product.stock }} unités)
                        </span>
                      } @else {
                        <span class="text-red-600 font-medium">Rupture de stock</span>
                      }
                    </div>
                  </div>
                }

                <!-- Quantity Selector -->
                <div class="mb-6">
                  <h2 class="text-lg font-semibold text-gray-900 mb-2">Quantité</h2>
                  <div class="flex items-center gap-3">
                    <button
                      (click)="decreaseQuantity()"
                      class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-semibold"
                      [disabled]="quantity <= 1"
                    >
                      -
                    </button>
                    <span class="text-xl font-semibold px-4">{{ quantity }}</span>
                    <button
                      (click)="increaseQuantity()"
                      class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-semibold"
                      [disabled]="product.stock && quantity >= product.stock"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <!-- Add to Cart Button -->
              <div class="space-y-3">
                <button
                  (click)="addToCart(product)"
                  [disabled]="!product.stock || product.stock <= 0"
                  class="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
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
                  {{ !product.stock || product.stock <= 0 ? 'Rupture de stock' : 'Ajouter au panier' }}
                </button>

                @if (showSuccessMessage) {
                  <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Produit ajouté au panier avec succès!
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Chargement du produit...</p>
        </div>
      }

      @if (error) {
        <div class="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 class="text-2xl font-semibold text-gray-700 mb-2">Produit introuvable</h2>
          <p class="text-gray-500 mb-6">Le produit que vous recherchez n'existe pas.</p>
          <a
            routerLink="/shop/products"
            class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux produits
          </a>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class ProductDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private store = inject(Store);

  product$: Observable<Product | null> = of(null);
  error = false;
  quantity = 1;
  showSuccessMessage = false;

  ngOnInit(): void {
    window.scrollTo(0, 0);
    const productId = this.route.snapshot.paramMap.get('id');
    
    if (productId) {
      this.product$ = this.http.get<Product>(`/api/products/${productId}/`).pipe(
        catchError(() => {
          this.error = true;
          return of(null);
        }),
      );
    } else {
      this.error = true;
    }
  }

  getAverageRating(product: Product): string {
    if (!product.ratings || product.ratings.length === 0) return '0.0';
    const sum = product.ratings.reduce((acc, r) => acc + r.value, 0);
    return (sum / product.ratings.length).toFixed(1);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: Product): void {
    this.store.dispatch(addItem({ product, quantity: this.quantity }));
    this.showSuccessMessage = true;
    
    // Hide message after 3 seconds
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }
}
