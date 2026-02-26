import { Component, Inject, OnInit } from '@angular/core';
import { exitLoginSession } from '@shared/services';
import { AccountService } from '../account.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debugMode, getTokens, saveTokens } from '@shared/storages';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  title = 'Account Portal';
  tokenString: string = '';
  debugMode: boolean = false;

  constructor(
    @Inject('AccountService') private service: AccountService,
  ) {
    const tokens = getTokens('session');
    if (tokens.access && tokens.refresh) {
      this.tokenString = `${tokens.access},${tokens.refresh}`;
    }
    this.debugMode = debugMode();
  }

  ngOnInit(): void {
    this.service.gateway.get().subscribe({
      next: () => {
        this.service.gateway.validateToken(getTokens('session')).subscribe({
          error: err => {
            console.log(err);
          }
        });
      },
      error: err => {
        console.log(err);
      }
    })
  }
  
  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  onLogout(): void {
    exitLoginSession();
    window.location.reload();
  }

  onChange(event: Event): void {
    const tokens = this.tokenString.split(',');
    if (tokens.length === 2) {
      saveTokens('session', tokens[0].trim(), tokens[1].trim());

      this.service.gateway.get().subscribe({
        next: () => {
          this.service.gateway.validateToken(getTokens('session')).subscribe({
            next: res => {
              if (res.role) {
                window.location.reload();
              }
            },
            error: err => {
              console.log(err);
            }
          });
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }
}
