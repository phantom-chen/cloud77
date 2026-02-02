import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { Home3Component } from './home3/home3.component';
import { Home2Component } from './home2/home2.component';
import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'home2', component: Home2Component },
  { path: 'home3', component: Home3Component },
  { path: 'tasks/:id', component: TasksComponent },
  { path: 'tasks', component: TasksComponent },
  { path: '**', component: NotFoundComponent }
];
