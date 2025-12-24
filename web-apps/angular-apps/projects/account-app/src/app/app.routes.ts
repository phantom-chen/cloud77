import { Routes } from '@angular/router';
import { MessageComponent } from './message/message.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { SettingComponent } from './setting/setting.component';
import { TokenGuard } from './token.guard';
import { HistoryComponent } from './history/history.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';
import { FilesComponent } from './files/files.component';
import { TasksComponent } from './tasks/tasks.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { KeyGuard } from './key.guard';

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'message', component: MessageComponent
    },
    {
        path: "my",
        component: AccountComponent,
        canActivate: [KeyGuard, TokenGuard]
    },
    {
        path: "setting",
        component: SettingComponent,
        canActivate: [TokenGuard]
    },
    {
        path: "history",
        component: HistoryComponent,
        canActivate: [TokenGuard]
    },
    {
        path: "posts",
        component: PostsComponent,
        canActivate: [TokenGuard]
    },
    {
        path: "posts/:id",
        component: PostComponent,
        canActivate: [TokenGuard]
    },
    {
        path: "files",
        component: FilesComponent,
        canActivate: [TokenGuard]
    },
    {
        path: "tasks",
        component: TasksComponent,
        canActivate: [TokenGuard]
    },
    {
        path: "**",
        component: NotFoundComponent
    }
];
