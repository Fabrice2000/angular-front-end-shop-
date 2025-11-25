import type { Meta, StoryObj } from '@storybook/angular';
import { CartItemComponent } from '../shop/cart/cart-item.component';
import { Product } from '../../mocks/data';

const meta: Meta<CartItemComponent> = {
  title: 'Shop/CartItem',
  component: CartItemComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CartItemComponent>;

const mockProduct: Product = {
  id: 1,
  name: 'Stylo Bleu Premium',
  price: 2.5,
  created_at: '2025-01-10T10:00:00Z',
  owner_id: 10,
  ratings: [{ user_id: 2, value: 4 }],
  description: 'Un stylo à bille bleu de haute qualité',
  stock: 45,
  image: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Stylo+Bleu',
  category: 'Écriture',
};

export const Default: Story = {
  args: {
    item: {
      product: mockProduct,
      quantity: 2,
    },
  },
};

export const SingleItem: Story = {
  args: {
    item: {
      product: mockProduct,
      quantity: 1,
    },
  },
};

export const MultipleItems: Story = {
  args: {
    item: {
      product: mockProduct,
      quantity: 5,
    },
  },
};

export const LowStock: Story = {
  args: {
    item: {
      product: {
        ...mockProduct,
        stock: 2,
      },
      quantity: 1,
    },
  },
};

export const OutOfStock: Story = {
  args: {
    item: {
      product: {
        ...mockProduct,
        stock: 0,
      },
      quantity: 1,
    },
  },
};
