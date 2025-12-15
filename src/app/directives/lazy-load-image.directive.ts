import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'img[appLazyLoad]',
})
export class LazyLoadImageDirective implements OnInit {
  @Input() appLazyLoad!: string;
  @Input() placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23e2e8f0" width="400" height="400"/%3E%3C/svg%3E';

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const img = this.el.nativeElement;

    // Set placeholder
    this.renderer.setAttribute(img, 'src', this.placeholder);
    this.renderer.addClass(img, 'lazy-loading');

    // Use Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage();
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before entering viewport
        }
      );

      observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage();
    }
  }

  private loadImage(): void {
    const img = this.el.nativeElement;
    const tempImg = new Image();

    tempImg.onload = () => {
      this.renderer.setAttribute(img, 'src', this.appLazyLoad);
      this.renderer.removeClass(img, 'lazy-loading');
      this.renderer.addClass(img, 'lazy-loaded');
    };

    tempImg.onerror = () => {
      console.error(`Failed to load image: ${this.appLazyLoad}`);
      this.renderer.addClass(img, 'lazy-error');
    };

    tempImg.src = this.appLazyLoad;
  }
}
