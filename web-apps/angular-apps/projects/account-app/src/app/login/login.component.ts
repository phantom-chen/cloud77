import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { getRemainingTime, getTokens, getUserEmail, removeTokens, saveTokens, SharedModule, syncTokens, timestampToDate, updateUserEmail } from "../../../../../src/app/shared";
import { debugMode } from '../../../../../src/app/shared';
import { IGatewayService, SNACKBAR_DURATION } from '../service';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

export interface IHandleHttpError {
  handleHttpError(response: HttpErrorResponse): void
}

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
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    SharedModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(
    @Inject('IGatewayService') private gateway: IGatewayService,
    private snackbar: MatSnackBar,
    private san: DomSanitizer) {
    this.debugMode = debugMode();
    if (this.debugMode) {
      this.logs += 'Debug Mode\n';
    }
    this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(sessionStorage.getItem('user_app_message') ?? '');
  }

  ngAfterViewInit(): void {
    if (getTokens(false).access) {
      this.onNavigate();
    }
  }

  ngOnInit(): void {
    // sync local storage to session storage
    this.remember = (localStorage.getItem('cloud77_remember') ?? '')?.length > 0 ? true : false;
    // this.remember = true;
    const tokens = getTokens(false);
    this.hasTokens = (tokens.access !== '' && tokens.refresh !== '');

    this.authenticatedAccount = this.authenticatedUsers.length > 0 ? this.authenticatedUsers[0] : '';
    if (getUserEmail()) {
      this.account = getUserEmail();
    }

    window.addEventListener('message', function (ev) {
      if (ev.data) {
        if (ev.data.name === 'tokens_saved') {
          const appUrl = sessionStorage.getItem('user_app_url') ?? '';
          sessionStorage.removeItem('user_app_message');
          sessionStorage.removeItem('user_app_url');
          sessionStorage.removeItem('user_app_host');
          window.location.href = appUrl;
        }

        if (ev.data.request === 'logout') {

        }
      }
    });

    this.gateway
  }

  handleHttpError(error: HttpErrorResponse) {
    this.snackbar.open(
      `${error.status} - ${error.statusText}`,
      `${error.error ? error.error.message : error.statusText}`,
      {
        duration: SNACKBAR_DURATION
      }
    )
    if (error.status === 401) {
      this.snackbar.open('Error', 'Unauthorized', { duration: SNACKBAR_DURATION });
    } else {

    }
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
      })
      .catch(err => {
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          this.handleHttpError(err);
        }
      });
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.type === 'keyup' && event.key === 'Enter') {
      this.onLoginClick();
    }
  }

  onCheckTokens(): void {
    syncTokens();
    this.gateway.validateToken().then(res => {
      this.hasValidTokens = true;
      const exp: Date = timestampToDate(res);
      const current: Date = new Date();
      const diff = getRemainingTime(current, exp);
      console.log(`Remaining: ${diff.day} days / ${diff.hour} hours / ${diff.minute} minute`);
      this.snackbar.open('Info', `Remaining: ${diff.day} days / ${diff.hour} hours / ${diff.minute} minute`, { duration: SNACKBAR_DURATION });
    });
  }

  onLogout(): void {
    removeTokens();
    this.snackbar.open('info', 'Logout successfully.', { duration: SNACKBAR_DURATION });
  }

  onNavigate(): void {
    const appUrl = sessionStorage.getItem('user_app_url') ?? '';
    const messageUrl = sessionStorage.getItem('user_app_message') ?? '';

    if (appUrl && messageUrl) {
      const tokens = getTokens(false);
      this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(messageUrl);

      setTimeout(() => {
        this.messageContainer.nativeElement.contentWindow?.postMessage({
          name: 'sync-tokens',
          accessToken: tokens.access,
          refreshToken: tokens.refresh
        }, '*')
      }, 1000);
    }
  }

  copyToken(name: string): void {
    const tokens = getTokens(false);
    const access = tokens.access;
    const refresh = tokens.refresh;
    const token = name.length === 0 ? access : refresh;

    if (token) {
      navigator.clipboard.writeText(token)
        .then(() => {
          alert(`${name.length === 0 ? 'Access' : 'Refresh'} Token copied to clipboard!`);
        })
        .catch(err => {
          console.error('Failed to copy tokens: ', err);
        });
    } else {
      alert('No token found!');
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
