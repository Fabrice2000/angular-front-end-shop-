import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../services/toast.service';
import { Observable } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-toast-container',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ]),
    ]),
  ],
  template: `
    <div class="toast-container">
      @for (toast of toasts$ | async; track toast.id) {
        <div
          class="toast"
          [ngClass]="'toast-' + toast.type"
          @toastAnimation
          (click)="remove(toast.id)"
        >
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @case ('warning') { ⚠ }
              @case ('info') { ℹ }
            }
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button class="toast-close" (click)="remove(toast.id)" aria-label="Fermer">×</button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      }

      .toast {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: white;
        cursor: pointer;
        transition: transform 0.2s;
      }

      .toast:hover {
        transform: translateX(-5px);
      }

      .toast-success {
        border-left: 4px solid #10b981;
      }

      .toast-error {
        border-left: 4px solid #ef4444;
      }

      .toast-warning {
        border-left: 4px solid #f59e0b;
      }

      .toast-info {
        border-left: 4px solid #3b82f6;
      }

      .toast-icon {
        font-size: 20px;
        font-weight: bold;
      }

      .toast-success .toast-icon {
        color: #10b981;
      }

      .toast-error .toast-icon {
        color: #ef4444;
      }

      .toast-warning .toast-icon {
        color: #f59e0b;
      }

      .toast-info .toast-icon {
        color: #3b82f6;
      }

      .toast-message {
        flex: 1;
        font-size: 14px;
        color: #1f2937;
      }

      .toast-close {
        background: none;
        border: none;
        font-size: 24px;
        color: #6b7280;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
      }

      .toast-close:hover {
        color: #1f2937;
      }
    `,
  ],
})
export class ToastContainerComponent implements OnInit {
  toasts$!: Observable<Toast[]>;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toasts$ = this.toastService.toasts$;
  }

  remove(id: string): void {
    this.toastService.remove(id);
  }
}
