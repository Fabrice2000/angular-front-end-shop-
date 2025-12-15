import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { tap, switchMap, shareReplay } from 'rxjs/operators';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Stratégie stale-while-revalidate:
   * - Retourne les données du cache si elles existent (même obsolètes)
   * - En arrière-plan, lance une nouvelle requête si les données sont obsolètes
   */
  get<T>(
    key: string,
    fetchFn: () => Observable<T>,
    ttl: number = this.DEFAULT_TTL
  ): Observable<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached) {
      const isStale = now - cached.timestamp > ttl;

      if (isStale) {
        // Données obsolètes: retourner le cache et revalider en arrière-plan
        setTimeout(() => {
          fetchFn()
            .pipe(tap((data) => this.set(key, data)))
            .subscribe();
        }, 0);
      }

      return of(cached.data);
    }

    // Pas de cache: fetch et mettre en cache
    return fetchFn().pipe(
      tap((data) => this.set(key, data)),
      shareReplay(1)
    );
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}
