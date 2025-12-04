import { Component, Inject, OnInit } from '@angular/core';
import { EventEntity } from '@phantom-chen/cloud77';
import { CommonModule, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { UnAuthorizedComponent } from '../un-authorized/un-authorized.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    UnAuthorizedComponent,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule,
    DatePipe
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {

  constructor(
    @Inject('AccountService') private service: AccountService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) { }

  loading: boolean = true;
  isLogin: boolean = false;
  email: string = '';
  history: EventEntity[] = [];

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe({
      next: res => {
        this.loading = false;
        if (res.expiration) {
          this.isLogin = true;
          this.service.getHistory().subscribe({
            next: data => {
              this.history = data.data;
            }
          });
        }
      }
    });
    this.service.gateway.validateToken();
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }
}
