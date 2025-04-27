import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { getRemainingTime, getTokens, getUserEmail, saveTokens, SharedModule, timestampToDate, updateUserEmail } from "../../../../../src/app/shared";
import { debugMode } from '../../../../../src/app/shared';
import { IGatewayService } from '../service';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    SharedModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(
    @Inject('IGatewayService') private gateway: IGatewayService,
    private san: DomSanitizer) {
      this.debugMode = debugMode();
      if (this.debugMode) {
        this.logs += 'Debug Mode\n';
      }
      this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(sessionStorage.getItem('app_message') ?? '');
    }

  ngOnInit(): void {
    // sync local storage to session storage
    const tokens = getTokens();
    this.hasTokens = (tokens.access !== '' && tokens.refresh !== '');

    this.authenticatedAccount = this.authenticatedUsers.length > 0 ? this.authenticatedUsers[0] : '';
    if (getUserEmail()) {
      this.account = getUserEmail();
    }

    window.addEventListener('message', function(ev) {
      if (ev.data) {
        console.log(ev.data);
        if (ev.data.response === 'user-login-success') {
          const appUrl = sessionStorage.getItem('app_url') ?? '';
          sessionStorage.removeItem('app_message');
          sessionStorage.removeItem('app_url');
          sessionStorage.removeItem('app_host');
          window.location.href = appUrl;
        }
      }
    });
  }

  tokenValidity: number = 100;
  hasValidTokens: boolean = false;
  hasTokens: boolean = false;
  remember = true;
  account: string = '';
  authenticatedAccount: string = '';
  password = '';

  loginRequired: boolean = true;

  users: string[] = [];
  authenticatedUsers: string[] = [];
  logs = '';
  
  pageTitle = '';
  
  frameResourceUrl?: SafeResourceUrl;
  debugMode: boolean = false;
  existing: boolean = true;

  @ViewChild("messageContainer")
  messageContainer!: ElementRef<HTMLIFrameElement>;
  
  onAccountChange() {
    this.gateway.getUser(this.account)
    .then(res => {
      this.existing = res.existing;
    });
  }

  onLoginClick() {
    this.gateway.generateToken(this.account, this.password)
    .then(data => {
      updateUserEmail(data.email);
      saveTokens(data.value, data.refreshToken);
      this.onNavigate();
    });
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.type === 'keyup' && event.key === 'Enter') {
      this.onLoginClick();
    }
  }

  onCheckTokens(): void {
    this.gateway.validateToken().then(res => {
      this.hasValidTokens = true;
      const exp: Date = timestampToDate(res);
      const current: Date = new Date();
      const diff = getRemainingTime(current, exp);
      console.log(`Remaining: ${diff.day} days / ${diff.hour} hours / ${diff.minute} minute`);
    });
  }

  onLogout(): void {
    alert('wip')
  }

  onNavigate(): void {
    const appUrl = sessionStorage.getItem('app_url') ?? '';
    const messageUrl = sessionStorage.getItem('app_message') ?? '';
    console.log('debug: navigate');
    console.log(appUrl);
    console.log(messageUrl);
    if (appUrl && messageUrl) {
      const tokens = getTokens();
      console.log(tokens);
      this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(messageUrl);
      setTimeout(() => {
        this.messageContainer.nativeElement.contentWindow?.postMessage({
          response: 'sync-tokens',
          accessToken: tokens.access,
          refreshToken: tokens.refresh
        }, '*')
      }, 2000);
    }
  }

  clearLogin(): void {
    alert('wip')
    // if (this.account) {
    //   removeUserEmail(this.account);
    //   this.account = this.users.length > 0 ? this.users[0] : '';
    //   this.authenticatedAccount = this.authenticatedUsers.length > 0 ? this.authenticatedUsers[0] : '';
    // }
  }

  autoLogin(): void {
    alert('wip')
    // if (this.authenticatedAccount) {
    //   if (this.messageUrl) {
    //     const tokens = getTokens(this.authenticatedAccount);
    //     if (tokens.access) {

    //     }
    //   } else {
    //     syncTokens(this.authenticatedAccount);
    //     if (this.pageUrl) {
    //       window.location.href = this.pageUrl;
    //     }
    //   }
    // }
  }
}
