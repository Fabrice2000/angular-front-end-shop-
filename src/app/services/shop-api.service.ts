import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, OrderSummary, OrderDetails } from '../state/user/user.actions';
import { Product } from '../../mocks/data';

export interface TokenResponse {
  access: string;
  refresh?: string;
}

export interface ProductsResponse {
  count: number;
  results: Product[];
}

export interface RatingResponse {
  product_id: number;
  avg_rating: number;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class ShopApiService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('/api/auth/token/', { username, password });
  }

  refresh(refresh: string) {
    return this.http.post<TokenResponse>('/api/auth/token/refresh/', { refresh });
  }

  getProducts(params: {
    page?: number;
    page_size?: number;
    min_rating?: number;
    ordering?: string;
  }) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) httpParams = httpParams.set(k, String(v));
    });
    return this.http.get<ProductsResponse>('/api/products/', { params: httpParams });
  }

  getRating(productId: number) {
    return this.http.get<RatingResponse>(`/api/products/${productId}/rating/`);
  }

  // User profile endpoints
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/me/');
  }

  updateUserProfile(updates: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>('/api/me/', updates);
  }

  // User orders endpoints
  getUserOrders(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>('/api/me/orders/');
  }

  getOrderDetails(orderId: string): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`/api/orders/${orderId}/`);
  }

  // Wishlist endpoints
  getWishlist(): Observable<string[]> {
    return this.http.get<string[]>('/api/me/wishlist/');
  }

  addToWishlist(productId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>('/api/me/wishlist/', { productId, action: 'add' });
  }

  removeFromWishlist(productId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>('/api/me/wishlist/', { productId, action: 'remove' });
  }

  // Reviews endpoints
  getProductReviews(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/products/${productId}/reviews/`);
  }

  createProductReview(productId: string, rating: number, comment: string): Observable<any> {
    return this.http.post<any>(`/api/products/${productId}/reviews/`, { rating, comment });
  }

  // Promo code and cart validation endpoints
  applyPromoCode(cartItems: any[], promoCode: string): Observable<any> {
    return this.http.post<any>('/api/cart/apply-promo/', { items: cartItems, code: promoCode });
  }

  validateCartStock(cartItems: any[]): Observable<any> {
    return this.http.post<any>('/api/cart/validate-stock/', { items: cartItems });
  }

  // Admin endpoints
  getAdminStats(): Observable<any> {
    return this.http.get<any>('/api/admin/stats/');
  }
}
