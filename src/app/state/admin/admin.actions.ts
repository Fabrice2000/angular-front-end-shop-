import { createAction, props } from '@ngrx/store';

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    sales: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}

// Load admin statistics
export const loadAdminStats = createAction('[Admin] Load Stats');

export const loadAdminStatsSuccess = createAction(
  '[Admin] Load Stats Success',
  props<{ stats: AdminStats }>()
);

export const loadAdminStatsFailure = createAction(
  '[Admin] Load Stats Failure',
  props<{ error: any }>()
);
