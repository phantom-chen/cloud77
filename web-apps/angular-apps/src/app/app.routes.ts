import { Routes } from '@angular/router';
import { SampleComponent } from './pages/sample/sample.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MessageComponent } from './pages/message/message.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
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
    path: '**', component: NotFoundComponent
  }
];
