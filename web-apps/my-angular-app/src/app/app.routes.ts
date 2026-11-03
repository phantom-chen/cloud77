import { Routes } from '@angular/router';
import { FirstPage } from './pages/first-page/first-page';
import { SecondPage } from './pages/second-page/second-page';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
  {
    path: '', component: HomePage,
  },
  {
    path: 'first', component: FirstPage,
  },
  {
    path: 'second', component: SecondPage
  }
];
