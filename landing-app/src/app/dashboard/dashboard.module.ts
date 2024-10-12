import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { provideRouter, Routes } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { SettingsComponent } from './settings/settings.component';
import { HistoryComponent } from './history/history.component';
import { QueuesComponent } from './queues/queues.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'accounts',
    component: AccountsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'queues',
    component: QueuesComponent
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
