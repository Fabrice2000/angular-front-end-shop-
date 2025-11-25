import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { CartIconComponent } from '../shop/cart/cart-icon.component';
import { cartReducer } from '../state/cart/cart.reducer';

const meta: Meta<CartIconComponent> = {
  title: 'Shop/CartIcon',
  component: CartIconComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        provideStore({
          cart: cartReducer,
        }),
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<CartIconComponent>;

export const Empty: Story = {};

export const WithItems: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        provideStore({
          cart: () => ({
            items: [
              { product: { id: 1, name: 'Test', price: 10 }, quantity: 2 },
            ],
            totalPrice: 20,
            count: 2,
            discount: 0,
            loading: false,
            error: null,
          }),
        }),
      ],
    }),
  ],
};

export const ManyItems: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        provideStore({
          cart: () => ({
            items: Array.from({ length: 50 }, (_, i) => ({
              product: { id: i, name: `Product ${i}`, price: 10 },
              quantity: 1,
            })),
            totalPrice: 500,
            count: 50,
            discount: 0,
            loading: false,
            error: null,
          }),
        }),
      ],
    }),
  ],
};

export const OverHundredItems: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        provideStore({
          cart: () => ({
            items: Array.from({ length: 150 }, (_, i) => ({
              product: { id: i, name: `Product ${i}`, price: 10 },
              quantity: 1,
            })),
            totalPrice: 1500,
            count: 150,
            discount: 0,
            loading: false,
            error: null,
          }),
        }),
      ],
    }),
  ],
};
