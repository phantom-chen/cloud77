import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessageComponent } from './message/message.component';
import { DatabaseComponent } from './database/database.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'database', component: DatabaseComponent },
    { path: 'message', component: MessageComponent }
];
