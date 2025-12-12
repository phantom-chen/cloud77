import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UserComponent } from './pages/user/user.component';
import { TutorialComponent } from './pages/tutorial/tutorial.component';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'tutorial',
    component: TutorialComponent,
  },
  {
    path: 'layout',
    component: LayoutComponent
  },
  {
    path: 'sso',
    component: UserComponent,
    loadChildren: () => import('./sso/sso.module').then(m => m.SsoModule)
  },
  {
    path: '**', component: NotFoundComponent
  }
];
