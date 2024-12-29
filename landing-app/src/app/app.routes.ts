import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ToolComponent } from './pages/tool/tool.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './pages/user/user.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';

export const routes: Routes = [
  {
    path: '', component: AppComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'sign-up', component: SignUpComponent
  },
  {
    path: 'confirm-email', component: ConfirmEmailComponent
  },
  {
    path: 'reset-password', component: ResetPasswordComponent
  },
  {
    path: 'tool', component: ToolComponent
  },
  {
    path: 'user',
    component: UserComponent,
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) 
  },
  {
    path: '**', component: AppComponent
  }
];
