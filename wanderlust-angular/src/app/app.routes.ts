import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/listings/listing-list/listing-list.component').then(m => m.ListingListComponent)
  },
  {
    path: 'listings/new',
    loadComponent: () =>
      import('./features/listings/listing-form/listing-form.component').then(m => m.ListingFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'listings/:id',
    loadComponent: () =>
      import('./features/listings/listing-detail/listing-detail.component').then(m => m.ListingDetailComponent)
  },
  {
    path: 'listings/:id/edit',
    loadComponent: () =>
      import('./features/listings/listing-form/listing-form.component').then(m => m.ListingFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
