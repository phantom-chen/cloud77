import { Routes } from '@angular/router';
import { ToolComponent } from './pages/tool/tool.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './pages/user/user.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { SampleComponent } from './pages/sample/sample.component';
import { PostComponent } from './pages/post/post.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { MessageComponent } from './pages/message/message.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'logout', component: LogoutComponent
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
    path: 'posts/:id', component: PostComponent
  },
  {
    path: 'message', component: MessageComponent
  },
  {
    path: 'sample',
    component: SampleComponent,
    loadChildren: () => import('./sample/sample.module').then(m => m.SampleModule)
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
    path: '**', component: NotFoundComponent
  }
];
