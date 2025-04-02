import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { HistoryComponent } from './history/history.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';
import { LiveChartComponent } from './live-chart/live-chart.component';
import { SettingComponent } from './setting/setting.component';
import { OrdersComponent } from './orders/orders.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent
  },
  {
    path: 'setting', component: SettingComponent
  },
  {
    path: 'history', component: HistoryComponent
  },
  {
    path: 'posts', component: PostsComponent
  },
  {
    path: 'posts/:id', component: PostComponent
  },
  {
    path: 'chart', component: LiveChartComponent
  },
  {
    path: 'orders', component: OrdersComponent
  },
  {
    path: 'tasks', component: TasksComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    provideRouter(routes)
  ],
})
export class UserModule { }