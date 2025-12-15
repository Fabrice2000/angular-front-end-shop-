import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card.component';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [CommonModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="products-grid">
      <ng-container *ngFor="let p of products || []; trackBy: trackByProductId">
        <app-product-card 
          [id]="p.id" 
          [name]="p.name" 
          [price]="p.price" 
          [created_at]="p.created_at" 
          [avgRating]="p.avgRating"
          [image]="p.image"
          [category]="p.category"
          [description]="p.description"
          [stock]="p.stock"
          [lowStockThreshold]="p.lowStockThreshold">
        </app-product-card>
      </ng-container>
    </div>
  `,
  styles: [`.products-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
    gap: 24px; 
    margin-top: 24px;
  }`],
})
export class ProductsListComponent {
  @Input() products: any[] = [];
  
  trackByProductId(index: number, product: any): number {
    return product.id;
  }
}
