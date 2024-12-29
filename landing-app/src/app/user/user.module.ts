import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    provideRouter(routes)
  ],
})
export class UserModule { }