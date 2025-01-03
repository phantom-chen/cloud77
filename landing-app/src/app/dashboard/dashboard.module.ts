import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { SettingsComponent } from './settings/settings.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MessagesComponent } from './messages/messages.component';
import { AccountsComponent } from './accounts/accounts.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'messages',
    component: MessagesComponent
  },
  {
    path: 'accounts',
    component: AccountsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideRouter(routes)
  ]
})
export class DashboardModule { }
