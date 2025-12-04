import { Routes } from '@angular/router';
import { SampleComponent } from './pages/sample/sample.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UserComponent } from './pages/user/user.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'hello',
    component: SampleComponent,
    loadChildren: () => import('./sample/sample.module').then(m => m.SampleModule)
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
