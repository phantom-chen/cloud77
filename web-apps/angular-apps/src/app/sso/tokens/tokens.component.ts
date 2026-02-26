import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { getTokens } from '@shared/storages';

@Component({
  selector: 'app-tokens',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './tokens.component.html',
  styleUrl: './tokens.component.css'
})
export class TokensComponent {
  @Input()
  account: string = '';

  @Input()
  tokenValidity = '';
  
  @Input()
  openingMessage = '';

  @Output()
  copy: EventEmitter<string> = new EventEmitter();

  @Output()
  refresh: EventEmitter<void> = new EventEmitter();

  @Output()
  logout: EventEmitter<void> = new EventEmitter();

  copyTokens(): void {
    const tokens = getTokens('local');
    const access = tokens.access;
    const refresh = tokens.refresh;
    if (tokens && tokens.access && tokens.refresh) {
      this.copy.emit(`${access},${refresh}`);
    }
  }

  onLogout(): void {
    this.logout.emit();
  }

  onRefreshToken(): void {
    this.refresh.emit();
  }
}
