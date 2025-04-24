import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './posts/posts.component';
import { FilesComponent } from './files/files.component';
import { DiagramComponent } from './diagram/diagram.component';
import { LayoutComponent } from './layout/layout.component';
import { LiveChartComponent } from './live-chart/live-chart.component';
import { OrdersComponent } from './orders/orders.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'posts', component: PostsComponent },
    { path: 'files', component: FilesComponent },
    { path: 'diagram', component: DiagramComponent },
    { path: 'layout', component: LayoutComponent },
    { path: 'chart', component: LiveChartComponent },
    { path: 'orders', component: OrdersComponent }
];
