import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AccountsComponent } from './accounts/accounts.component';
import { HistoryComponent } from './history/history.component';
import { MessageComponent } from './message/message.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { QueuesComponent } from './queues/queues.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'message', component: MessageComponent },
    { path: 'statistics', component: StatisticsComponent },
    { path: 'accounts', component: AccountsComponent },
    { path: 'history', component: HistoryComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'queues', component: QueuesComponent },
    { path: '**', component: NotFoundComponent },
];
