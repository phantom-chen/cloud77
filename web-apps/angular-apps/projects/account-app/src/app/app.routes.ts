import { Routes } from '@angular/router';
import { SettingComponent } from './setting/setting.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';
import { TasksComponent } from './tasks/tasks.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { AccountComponent } from './account/account.component';
import { HistoryComponent } from './history/history.component';

export const routes: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        path: 'logout', component: LogoutComponent
    },
    {
        path: 'sign-up', component: SignUpComponent
    },
    {
        path: 'reset-password', component: ResetPasswordComponent
    },
    {
        path: 'confirm-email', component: ConfirmEmailComponent
    },
    {
        path: 'dashboard',
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
        path: 'tasks', component: TasksComponent
    }
];
