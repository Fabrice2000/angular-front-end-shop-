import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../state/cart/cart.reducer';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      @if (item.product.image) {
        <img
          [src]="item.product.image"
          [alt]="item.product.name"
          class="w-20 h-20 object-cover rounded-md"
        />
      }
      
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 truncate">
          {{ item.product.name }}
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          Prix unitaire: {{ item.product.price.toFixed(2) }} €
        </p>
        @if (item.product.stock !== undefined) {
          <p class="text-xs text-gray-400 mt-1">
            Stock disponible: {{ item.product.stock }}
          </p>
        }
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <button
            (click)="decreaseQuantity()"
            class="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            [disabled]="item.quantity <= 1"
          >
            -
          </button>
          <input
            type="number"
            [value]="item.quantity"
            (input)="onQuantityChange($event)"
            min="1"
            [max]="item.product.stock || 999"
            class="w-16 text-center border border-gray-300 rounded px-2 py-1"
          />
          <button
            (click)="increaseQuantity()"
            class="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            [disabled]="item.product.stock && item.quantity >= item.product.stock"
          >
            +
          </button>
        </div>

        <div class="text-right min-w-[80px]">
          <p class="text-lg font-bold text-gray-900">
            {{ (item.product.price * item.quantity).toFixed(2) }} €
          </p>
        </div>

        <button
          (click)="removeItem.emit()"
          class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<void>();

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      this.quantityChange.emit(newQuantity);
    }
  }

  increaseQuantity(): void {
    const maxStock = this.item.product.stock || 999;
    if (this.item.quantity < maxStock) {
      this.quantityChange.emit(this.item.quantity + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.quantityChange.emit(this.item.quantity - 1);
    }
  }
}
