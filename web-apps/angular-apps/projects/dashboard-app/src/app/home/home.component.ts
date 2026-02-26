import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { exitLoginSession } from '@shared/services';
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
export class HomeComponent implements AfterViewInit {
  title = 'Dashboard Portal';
  tokenString: string = '';
  debugMode: boolean = false;

  constructor(
    @Inject('DashboardService') private service: DashboardService,
  ) {
    const tokens = getTokens('session');
    if (tokens.access && tokens.refresh) {
      this.tokenString = `${tokens.access},${tokens.refresh}`;
    }
    this.debugMode = debugMode();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
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
    }, 1000);

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
    }
  }
}
