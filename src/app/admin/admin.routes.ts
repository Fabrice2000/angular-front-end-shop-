import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./admin-dashboard-page.component').then(
        (m) => m.AdminDashboardPageComponent
      ),
  },
];
