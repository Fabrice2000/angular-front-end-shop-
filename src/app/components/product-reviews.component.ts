import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ReviewsActions from '../state/reviews/reviews.actions';
import { Review } from '../state/reviews/reviews.actions';
import {
  selectReviewsByProduct,
  selectReviewsLoading,
  selectAverageRatingByProduct,
  selectReviewsCountByProduct,
} from '../state/reviews/reviews.selectors';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-reviews">
      <div class="reviews-header mb-6">
        <h2 class="text-2xl font-bold mb-2">Avis clients</h2>
        @if (averageRating$ | async; as avgRating) {
          <div class="flex items-center gap-3">
            <div class="flex items-center">
              @for (star of [1, 2, 3, 4, 5]; track star) {
                <svg
                  class="w-6 h-6"
                  [class.text-yellow-400]="star <= avgRating"
                  [class.text-gray-300]="star > avgRating"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              }
            </div>
            <span class="text-lg font-semibold">{{ avgRating.toFixed(1) }} / 5</span>
            <span class="text-gray-600">({{ reviewsCount$ | async }} avis)</span>
          </div>
        }
      </div>

      <!-- Review Form -->
      <div class="review-form bg-gray-50 p-6 rounded-lg mb-6">
        <h3 class="text-lg font-semibold mb-4">Laisser un avis</h3>
        <form (ngSubmit)="submitReview()" #reviewForm="ngForm">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Votre note <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              @for (star of [1, 2, 3, 4, 5]; track star) {
                <button
                  type="button"
                  (click)="setRating(star)"
                  class="focus:outline-none"
                  [attr.aria-label]="star + ' étoiles'"
                >
                  <svg
                    class="w-8 h-8 transition"
                    [class.text-yellow-400]="star <= newReviewRating"
                    [class.text-gray-300]="star > newReviewRating"
                    [class.hover:text-yellow-300]="star > newReviewRating"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </button>
              }
            </div>
          </div>

          <div class="mb-4">
            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
              Votre commentaire <span class="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              [(ngModel)]="newReviewComment"
              name="comment"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Partagez votre expérience avec ce produit..."
            ></textarea>
          </div>

          <button
            type="submit"
            [disabled]="!newReviewRating || !newReviewComment || (loading$ | async)"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            @if (loading$ | async) {
              Envoi en cours...
            } @else {
              Publier mon avis
            }
          </button>
        </form>
      </div>

      <!-- Reviews List -->
      @if (loading$ | async) {
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (reviews$ | async; as reviews) {
        @if (reviews.length === 0) {
          <div class="text-center py-8 text-gray-600">
            <p>Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
          </div>
        } @else {
          <div class="space-y-4">
            @for (review of reviews; track review.id) {
              <div class="review-item bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="font-semibold text-gray-800">{{ review.user }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <div class="flex">
                        @for (star of [1, 2, 3, 4, 5]; track star) {
                          <svg
                            class="w-4 h-4"
                            [class.text-yellow-400]="star <= review.rating"
                            [class.text-gray-300]="star > review.rating"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        }
                      </div>
                      <span class="text-sm text-gray-500">
                        {{ formatDate(review.createdAt) }}
                      </span>
                    </div>
                  </div>
                </div>
                <p class="text-gray-700">{{ review.comment }}</p>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .product-reviews {
        margin-top: 2rem;
      }
    `,
  ],
})
export class ProductReviewsComponent implements OnInit {
  @Input() productId!: string;

  reviews$!: Observable<Review[]>;
  loading$!: Observable<boolean>;
  averageRating$!: Observable<number>;
  reviewsCount$!: Observable<number>;

  newReviewRating = 0;
  newReviewComment = '';

  constructor(private store: Store) {}

  ngOnInit() {
    this.reviews$ = this.store.select(selectReviewsByProduct(this.productId));
    this.loading$ = this.store.select(selectReviewsLoading);
    this.averageRating$ = this.store.select(selectAverageRatingByProduct(this.productId));
    this.reviewsCount$ = this.store.select(selectReviewsCountByProduct(this.productId));

    // Load reviews for this product
    this.store.dispatch(ReviewsActions.loadReviews({ productId: this.productId }));
  }

  setRating(rating: number) {
    this.newReviewRating = rating;
  }

  submitReview() {
    if (this.newReviewRating && this.newReviewComment.trim()) {
      this.store.dispatch(
        ReviewsActions.createReview({
          productId: this.productId,
          rating: this.newReviewRating,
          comment: this.newReviewComment.trim(),
        })
      );
      // Reset form
      this.newReviewRating = 0;
      this.newReviewComment = '';
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
