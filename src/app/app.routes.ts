import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthFormComponent } from './auth-form/auth-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: 'auth' },

];
  