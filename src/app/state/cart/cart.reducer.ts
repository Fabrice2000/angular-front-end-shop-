import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../mocks/data';
import * as CartActions from './cart.actions';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  count: number;
  discount: number;
  shipping: number;
  taxes: number;
  grandTotal: number;
  appliedPromos: string[];
  loading: boolean;
  error: string | null;
  stockValidationError: string | null;
}

export const initialState: CartState = {
  items: [],
  totalPrice: 0,
  count: 0,
  discount: 0,
  shipping: 0,
  taxes: 0,
  grandTotal: 0,
  appliedPromos: [],
  loading: false,
  error: null,
  stockValidationError: null,
};

const calculateTotals = (items: CartItem[]) => {
  const totalPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  return { totalPrice, count };
};

const saveToLocalStorage = (state: CartState) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state.items));
  } catch (err) {
    console.error('Failed to save cart to localStorage', err);
  }
};

export const cartReducer = createReducer(
  initialState,
  on(CartActions.addItem, (state, { product, quantity }) => {
    const existingItem = state.items.find((item) => item.product.id === product.id);
    let newItems: CartItem[];

    if (existingItem) {
      newItems = state.items.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
      );
    } else {
      newItems = [...state.items, { product, quantity }];
    }

    const { totalPrice, count } = calculateTotals(newItems);
    const newState = { ...state, items: newItems, totalPrice, count, error: null };
    saveToLocalStorage(newState);
    return newState;
  }),
  on(CartActions.removeItem, (state, { productId }) => {
    const newItems = state.items.filter((item) => item.product.id !== productId);
    const { totalPrice, count } = calculateTotals(newItems);
    const newState = { ...state, items: newItems, totalPrice, count, error: null };
    saveToLocalStorage(newState);
    return newState;
  }),
  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      const newItems = state.items.filter((item) => item.product.id !== productId);
      const { totalPrice, count } = calculateTotals(newItems);
      const newState = { ...state, items: newItems, totalPrice, count, error: null };
      saveToLocalStorage(newState);
      return newState;
    }

    const newItems = state.items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );
    const { totalPrice, count } = calculateTotals(newItems);
    const newState = { ...state, items: newItems, totalPrice, count, error: null };
    saveToLocalStorage(newState);
    return newState;
  }),
  on(CartActions.clearCart, () => {
    localStorage.removeItem('cart');
    return { ...initialState };
  }),
  on(CartActions.cartLoaded, (state, { cart }) => {
    try {
      const items: CartItem[] = JSON.parse(cart);
      const { totalPrice, count } = calculateTotals(items);
      return { ...state, items, totalPrice, count, error: null };
    } catch (err) {
      console.error('Failed to parse cart from localStorage', err);
      return state;
    }
  }),
  on(CartActions.validateCart, (state) => ({ ...state, loading: true, error: null })),
  on(CartActions.validateCartSuccess, (state, { totalPrice, discount }) => ({
    ...state,
    totalPrice,
    discount,
    loading: false,
    error: null,
  })),
  on(CartActions.validateCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Promo code handlers
  on(CartActions.applyPromoCode, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    CartActions.applyPromoCodeSuccess,
    (state, { itemsTotal, discount, shipping, taxes, grandTotal, appliedPromos }) => ({
      ...state,
      totalPrice: itemsTotal,
      discount,
      shipping,
      taxes,
      grandTotal,
      appliedPromos,
      loading: false,
      error: null,
    }),
  ),
  on(CartActions.applyPromoCodeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CartActions.removePromoCode, (state) => ({
    ...state,
    discount: 0,
    appliedPromos: [],
    grandTotal: state.totalPrice + state.shipping + state.taxes,
  })),

  // Stock validation handlers
  on(CartActions.validateStock, (state) => ({
    ...state,
    loading: true,
    stockValidationError: null,
  })),
  on(CartActions.validateStockSuccess, (state) => ({
    ...state,
    loading: false,
    stockValidationError: null,
  })),
  on(CartActions.validateStockFailure, (state, { error, productName }) => ({
    ...state,
    loading: false,
    stockValidationError: `Stock insuffisant pour ${productName || 'ce produit'}`,
  })),
);
