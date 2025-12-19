import { cartReducer, initialState, CartState } from './cart.reducer';
import * as CartActions from './cart.actions';
import { products } from '../../../mocks/data';

describe('cartReducer', () => {
  it('should add item and update count and total', () => {
    const product = products[0];
    const action = CartActions.addItem({ product, quantity: 2 });
    const state = cartReducer(initialState, action);
    expect(state.items.length).toBe(1);
    expect(state.count).toBe(2);
    expect(state.totalPrice).toBeCloseTo(product.price * 2, 2);
  });

  it('should update quantity and recalc total', () => {
    const product = products[0];
    const start = cartReducer(initialState, CartActions.addItem({ product, quantity: 1 }));
    const state = cartReducer(start, CartActions.updateQuantity({ productId: product.id, quantity: 3 }));
    expect(state.count).toBe(3);
    expect(state.totalPrice).toBeCloseTo(product.price * 3, 2);
  });

  it('should remove item and recalc total', () => {
    const product = products[0];
    let state = cartReducer(initialState, CartActions.addItem({ product, quantity: 1 }));
    state = cartReducer(state, CartActions.removeItem({ productId: product.id }));
    expect(state.items.length).toBe(0);
    expect(state.count).toBe(0);
    expect(state.totalPrice).toBe(0);
  });
});
