import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingComponent } from './setting/setting.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';
import { LiveChartComponent } from './live-chart/live-chart.component';
import { OrdersComponent } from './orders/orders.component';
import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'setting', component: SettingComponent
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
];
