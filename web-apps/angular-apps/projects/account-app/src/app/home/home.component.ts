import { Component, Inject } from '@angular/core';
import { exitLoginSession, getTokens, saveTokens } from '@shared/utils';
import { AccountService } from '../account.service';
import { CommonModule } from '@angular/common';
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

  title = 'Account Portal';
  tokenString: string = '';
  constructor(
    @Inject('AccountService') private service: AccountService,
  ) {
    const tokens = getTokens(true);
    if (tokens.access && tokens.refresh) {
      this.tokenString = `${tokens.access},${tokens.refresh}`;
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
    const tokens = this.tokenString.split(',');
    if (tokens.length === 2) {
      saveTokens(true, tokens[0].trim(), tokens[1].trim());
    }
  }
}
