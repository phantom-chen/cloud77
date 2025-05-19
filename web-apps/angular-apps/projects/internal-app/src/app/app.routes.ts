import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessageComponent } from './message/message.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'message', component: MessageComponent }
];
