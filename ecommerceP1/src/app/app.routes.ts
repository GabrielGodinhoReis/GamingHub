
import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products/Games',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboardComponent),
  },
  {
    path: 'products/:category',
    loadComponent: () => import('./pages/products-grid/products-grid'),
  },
  {
    path: 'product/:productId',
    loadComponent: () => import('./pages/view-product-detail/view-product-detail'),
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/my-account/my-account'),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/my-wishlist/my-wishlist'),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart'),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout'),
  },
  {
    path: 'order-success',
    loadComponent: () => import('./pages/order-success/order-success'),
  },
];
