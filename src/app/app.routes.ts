import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';
import { ExpenseClaimEntriesComponent } from './components/expense-claim-entries-component/expense-claim-entries-component';
import { LoginComponent } from './components/login-component/login-component';
import { RegisterComponent } from './components/register-component/register-component';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard]
  },
  {
    path: 'expense-claim-entries/:id',
    component: ExpenseClaimEntriesComponent,
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: '' }
];
