// src/app/app.routes.ts
import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => 
      import('./core/features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path:'create',
    loadComponent: () => 
      import('./core/features/auth/register/create.component').then(m => m.RegisterComponent)
  },
  {
    path:'desktop',
    loadComponent: () => 
      import('./core/features/desktop/desktop.component').then(m => m.DashboardComponent)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];