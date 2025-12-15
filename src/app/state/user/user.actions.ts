import { createAction, props } from '@ngrx/store';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  defaultAddress?: Address;
  preferences: {
    newsletter: boolean;
    defaultMinRating?: number;
  };
}

export interface OrderSummary {
  id: string;
  user: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

export interface OrderDetails extends OrderSummary {
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  shipping: number;
  shippingAddress: Address;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Load user profile
export const loadUserProfile = createAction('[User] Load Profile');
export const loadUserProfileSuccess = createAction(
  '[User] Load Profile Success',
  props<{ profile: UserProfile }>()
);
export const loadUserProfileFailure = createAction(
  '[User] Load Profile Failure',
  props<{ error: any }>()
);

// Update user profile
export const updateUserProfile = createAction(
  '[User] Update Profile',
  props<{ updates: Partial<UserProfile> }>()
);
export const updateUserProfileSuccess = createAction(
  '[User] Update Profile Success',
  props<{ profile: UserProfile }>()
);
export const updateUserProfileFailure = createAction(
  '[User] Update Profile Failure',
  props<{ error: any }>()
);

// Load user orders
export const loadUserOrders = createAction('[User] Load Orders');
export const loadUserOrdersSuccess = createAction(
  '[User] Load Orders Success',
  props<{ orders: OrderSummary[] }>()
);
export const loadUserOrdersFailure = createAction(
  '[User] Load Orders Failure',
  props<{ error: any }>()
);

// Load order details
export const loadOrderDetails = createAction(
  '[User] Load Order Details',
  props<{ orderId: string }>()
);
export const loadOrderDetailsSuccess = createAction(
  '[User] Load Order Details Success',
  props<{ order: OrderDetails }>()
);
export const loadOrderDetailsFailure = createAction(
  '[User] Load Order Details Failure',
  props<{ error: any }>()
);

// Clear user state
export const clearUserState = createAction('[User] Clear State');
