import { selectCartFinalTotal } from './cart.selectors';

describe('cart selectors', () => {
  it('selectCartFinalTotal projector computes total minus discount', () => {
    const total = 100;
    const discount = 15;
    const result = (selectCartFinalTotal as any).projector(total, discount);
    expect(result).toBe(85);
  });
});
