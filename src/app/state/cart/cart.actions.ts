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
