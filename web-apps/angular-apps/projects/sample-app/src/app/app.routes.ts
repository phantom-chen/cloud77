import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './posts/posts.component';
import { FilesComponent } from './files/files.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'posts', component: PostsComponent },
    { path: 'files', component: FilesComponent }
];
