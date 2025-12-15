import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-skeleton',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton" [ngClass]="'skeleton-' + type" [ngStyle]="{ width: width, height: height }">
      <div class="shimmer"></div>
    </div>
  `,
  styles: [
    `
      .skeleton {
        position: relative;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
      }

      .skeleton-text {
        height: 16px;
        margin-bottom: 8px;
      }

      .skeleton-title {
        height: 24px;
        margin-bottom: 12px;
      }

      .skeleton-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .skeleton-card {
        height: 200px;
        border-radius: 8px;
      }

      .skeleton-image {
        width: 100%;
        height: 200px;
      }

      .shimmer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: shimmer 1.5s infinite;
      }

      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `,
  ],
})
export class SkeletonComponent {
  @Input() type: 'text' | 'title' | 'avatar' | 'card' | 'image' = 'text';
  @Input() width = '100%';
  @Input() height = 'auto';
}
