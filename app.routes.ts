import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'books',
    loadChildren: () => import('./features/books/books.routes').then(m => m.bookRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'notes',
    loadChildren: () => import('./features/notes/notes.routes').then(m => m.noteRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'recommendations',
    loadChildren: () => import('./features/recommendations/recommendations.routes').then(m => m.recommendationRoutes)
  },
  {
    path: 'shared',
    loadComponent: () => import('./features/shared-collections/shared-collections.component').then(m => m.SharedCollectionsComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];