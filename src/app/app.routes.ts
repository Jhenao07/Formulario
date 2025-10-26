import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { QuestionsFormComponent } from './questions-form/questions-form.component';
import { TokenForm } from './token-form/token-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'questions', component: QuestionsFormComponent },
  { path: 'token', component: TokenForm},
];
