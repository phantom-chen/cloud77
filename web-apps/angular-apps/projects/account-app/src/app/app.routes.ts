import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SignUpComponent } from './sign-up/sign-up.component';
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

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'message', component: MessageComponent
    },
    {
        path: 'logout', component: LogoutComponent
    },
    {
        path: 'sign-up', component: SignUpComponent
    },
    {
        path: "my",
        component: AccountComponent,
        canActivate: [TokenGuard]
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
