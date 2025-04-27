import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AccountsComponent } from './accounts/accounts.component';
import { MessagesComponent } from './messages/messages.component';
import { SettingsComponent } from './settings/settings.component';
import { HistoryComponent } from './history/history.component';
import { MessageComponent } from './message/message.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'message', component: MessageComponent },
    { path: 'statistics', component: StatisticsComponent },
    { path: 'accounts', component: AccountsComponent },
    { path: 'messages', component: MessagesComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'history', component: HistoryComponent }
];
