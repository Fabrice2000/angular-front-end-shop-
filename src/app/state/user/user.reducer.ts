import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { OrderDetails, OrderSummary, UserProfile } from './user.actions';

export interface UserState {
  profile: UserProfile | null;
  orders: OrderSummary[];
  selectedOrder: OrderDetails | null;
  loading: boolean;
  error: any | null;
}

export const initialUserState: UserState = {
  profile: null,
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialUserState,

  // Load profile
  on(UserActions.loadUserProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadUserProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(UserActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update profile
  on(UserActions.updateUserProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.updateUserProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(UserActions.updateUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load orders
  on(UserActions.loadUserOrders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadUserOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false,
  })),
  on(UserActions.loadUserOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load order details
  on(UserActions.loadOrderDetails, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadOrderDetailsSuccess, (state, { order }) => ({
    ...state,
    selectedOrder: order,
    loading: false,
  })),
  on(UserActions.loadOrderDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear state
  on(UserActions.clearUserState, () => initialUserState)
);
