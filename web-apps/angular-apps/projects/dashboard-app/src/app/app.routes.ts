import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AccountsComponent } from './accounts/accounts.component';
import { HistoryComponent } from './history/history.component';
import { MessageComponent } from './message/message.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SystemComponent } from './system/system.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'message', component: MessageComponent },
    { path: 'statistics', component: StatisticsComponent },
    { path: 'accounts', component: AccountsComponent },
    { path: 'history', component: HistoryComponent },
    { path: 'system', component: SystemComponent },
    { path: '**', component: NotFoundComponent },
];
