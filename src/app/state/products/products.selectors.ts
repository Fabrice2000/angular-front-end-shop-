import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

export const selectProducts = createFeatureSelector<ProductsState>('products');

export const selectProductsList = createSelector(selectProducts, (s) => s.results);
export const selectProductsCount = createSelector(selectProducts, (s) => s.count);
export const selectProductsLoading = createSelector(selectProducts, (s) => s.loading);
export const selectProductsError = createSelector(selectProducts, (s) => s.error);

// Memoized selector: Products avec rating moyen calculé
export const selectProductsWithRatings = createSelector(
  selectProductsList,
  (products) =>
    products?.map((p) => ({
      ...p,
      avgRating: p.ratings?.length
        ? p.ratings.reduce((sum, r) => sum + r.value, 0) / p.ratings.length
        : 0,
    })) || []
);

// Memoized selector: Produits par catégorie
export const selectProductsByCategory = createSelector(
  selectProductsList,
  (products) => {
    const grouped: Record<string, any[]> = {};
    products?.forEach((p) => {
      const cat = p.category || 'Autres';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });
    return grouped;
  }
);

// Memoized selector: Produits en stock faible
export const selectLowStockProducts = createSelector(
  selectProductsList,
  (products) =>
    products?.filter(
      (p) => p.stock !== undefined && p.lowStockThreshold !== undefined && p.stock <= p.lowStockThreshold
    ) || []
);

// Memoized selector: Statistiques produits
export const selectProductsStats = createSelector(
  selectProductsList,
  (products) => ({
    total: products?.length || 0,
    inStock: products?.filter((p) => (p.stock || 0) > 0).length || 0,
    outOfStock: products?.filter((p) => (p.stock || 0) === 0).length || 0,
    lowStock: products?.filter(
      (p) => p.stock !== undefined && p.lowStockThreshold !== undefined && p.stock <= p.lowStockThreshold
    ).length || 0,
  })
);
