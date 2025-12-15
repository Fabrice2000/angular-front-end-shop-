import { createAction, props } from '@ngrx/store';
import { Product } from '../../../mocks/data';

export const addItem = createAction(
  '[Cart] Add Item',
  props<{ product: Product; quantity: number }>(),
);

export const removeItem = createAction('[Cart] Remove Item', props<{ productId: number }>());

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: number; quantity: number }>(),
);

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCart = createAction('[Cart] Load Cart');

export const cartLoaded = createAction('[Cart] Cart Loaded', props<{ cart: string }>());

export const validateCart = createAction('[Cart] Validate Cart');

export const validateCartSuccess = createAction(
  '[Cart] Validate Cart Success',
  props<{ totalPrice: number; discount: number }>(),
);

export const validateCartFailure = createAction(
  '[Cart] Validate Cart Failure',
  props<{ error: string }>(),
);

// Promo code actions
export const applyPromoCode = createAction(
  '[Cart] Apply Promo Code',
  props<{ code: string }>(),
);

export const applyPromoCodeSuccess = createAction(
  '[Cart] Apply Promo Code Success',
  props<{
    itemsTotal: number;
    discount: number;
    shipping: number;
    taxes: number;
    grandTotal: number;
    appliedPromos: string[];
  }>(),
);

export const applyPromoCodeFailure = createAction(
  '[Cart] Apply Promo Code Failure',
  props<{ error: string }>(),
);

export const removePromoCode = createAction('[Cart] Remove Promo Code');

// Stock validation actions
export const validateStock = createAction('[Cart] Validate Stock');

export const validateStockSuccess = createAction(
  '[Cart] Validate Stock Success',
  props<{ valid: boolean; message?: string }>(),
);

export const validateStockFailure = createAction(
  '[Cart] Validate Stock Failure',
  props<{ error: string; productName?: string }>(),
);
