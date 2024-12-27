import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ToolComponent } from './pages/tool/tool.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: '', component: AppComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'tool', component: ToolComponent
  },
  {
    path: '**', component: AppComponent
  }
];
