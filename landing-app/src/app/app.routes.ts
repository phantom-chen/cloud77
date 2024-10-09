import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MessageComponent } from './components/message/message.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'message', component: MessageComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'user',
    component: UserComponent,
    loadChildren: async() => (await import('./user/user.module')).UserModule
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: async() => (await import('./dashboard/dashboard.module')).DashboardModule
  },
  {
    path: '**', component: NotFoundComponent
  }
];
