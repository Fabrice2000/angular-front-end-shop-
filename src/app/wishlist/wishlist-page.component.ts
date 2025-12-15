import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { selectWishlistProductIds } from '../state/wishlist/wishlist.selectors';
import { selectProductsList } from '../state/products/products.selectors';
import * as WishlistActions from '../state/wishlist/wishlist.actions';
import * as CartActions from '../state/cart/cart.actions';
import { Product } from '../../mocks/data';

interface WishlistProduct extends Product {
  isInWishlist: boolean;
}

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Ma Liste de Souhaits</h1>

      @if (wishlistProducts$ | async; as products) {
        @if (products.length === 0) {
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <svg
              class="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p class="text-gray-600 mb-4">Votre liste de souhaits est vide.</p>
            <a
              routerLink="/shop/products"
              class="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Découvrir nos produits
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (product of products; track product.id) {
              <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
                <div class="relative">
                  <div class="aspect-video bg-gray-200 flex items-center justify-center">
                    <span class="text-gray-400 text-4xl">?</span>
                  </div>
                  <button
                    (click)="removeFromWishlist(product.id)"
                    class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                    aria-label="Retirer de la wishlist"
                  >
                    <svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>

                <div class="p-4">
                  <h3 class="text-lg font-semibold mb-2 truncate">
                    {{ product.name }}
                  </h3>
                  <p class="text-2xl font-bold text-blue-600 mb-4">
                    {{ product.price.toFixed(2) }} €
                  </p>

                  <div class="flex gap-2">
                    <button
                      (click)="addToCart(product)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Ajouter au panier
                    </button>
                    <a
                      [routerLink]="['/shop/products', product.id]"
                      class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                    >
                      Détails
                    </a>
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
export class WishlistPageComponent implements OnInit {
  wishlistProducts$!: Observable<WishlistProduct[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    const wishlistIds$ = this.store.select(selectWishlistProductIds);
    const allProducts$ = this.store.select(selectProductsList);

    this.wishlistProducts$ = wishlistIds$.pipe(
      withLatestFrom(allProducts$),
      map(([wishlistIds, products]) => {
        return products
          .filter((product: Product) => wishlistIds.includes(String(product.id)))
          .map((product: Product) => ({
            ...product,
            isInWishlist: true,
          }));
      })
    );
  }

  removeFromWishlist(productId: number) {
    this.store.dispatch(
      WishlistActions.removeFromWishlist({ productId: String(productId) })
    );
  }

  addToCart(product: Product) {
    this.store.dispatch(CartActions.addItem({ product, quantity: 1 }));
  }
}
