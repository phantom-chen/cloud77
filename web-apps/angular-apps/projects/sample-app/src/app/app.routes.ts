import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './posts/posts.component';
import { FilesComponent } from './files/files.component';
import { LiveChartComponent } from './live-chart/live-chart.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthorsComponent } from './authors/authors.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { LiveChatComponent } from './live-chat/live-chat.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'posts', component: PostsComponent },
    { path: 'files', component: FilesComponent },
    { path: 'chart', component: LiveChartComponent },
    { path: 'chat', component: LiveChatComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'authors', component: AuthorsComponent },
    { path: 'bookmarks', component: BookmarksComponent },
];
