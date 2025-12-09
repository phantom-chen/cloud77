import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { exitLoginSession, getTokens, saveTokens } from '@shared/utils';
import { FormsModule } from '@angular/forms';

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
export class HomeComponent {
  title = 'Dashboard Portal';
  tokenString: string = '';
  constructor(
    @Inject('DashboardService') private service: DashboardService,
  ) {
    const tokens = getTokens(true);
    if (tokens.access && tokens.refresh) {
      this.tokenString = `${tokens.access}\n\n${tokens.refresh}`;
    }
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  onLogout(): void {
    exitLoginSession();
    window.location.reload();
  }

  onChange(event: Event): void {
    const tokens = this.tokenString.split('\n\n');
    if (tokens.length === 2) {
      saveTokens(true, tokens[0], tokens[1]);
    }
  }
}
