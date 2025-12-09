import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { getRemainingTime, getTokens, getUserEmail, removeTokens, debugMode, timestampToDate, updateUserEmail } from "@shared/utils";
import { SharedModule } from '@shared/shared.module';
import { SNACKBAR_DURATION } from '@shared/utils';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from '../account.service';

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
    @Inject('AccountService') private service: AccountService,
    private snackbar: MatSnackBar,
    private san: DomSanitizer) {
    this.debugMode = debugMode();
    if (this.debugMode) {
      this.logs += 'Debug Mode\n';
    }
  }

  ngAfterViewInit(): void {
    if (getTokens(false).access) {

    }
  }

  ngOnInit(): void {
    // sync local storage to session storage
    this.remember = (localStorage.getItem('remember_me') ?? '')?.length > 0 ? true : false;
    // this.remember = true;
    const tokens = getTokens(false);
    this.hasTokens = (tokens.access !== '' && tokens.refresh !== '');

    this.authenticatedAccount = this.authenticatedUsers.length > 0 ? this.authenticatedUsers[0] : '';
    if (getUserEmail()) {
      this.account = getUserEmail();
    }
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

  serviceAvailable: boolean = false;
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


  debugMode: boolean = false;
  existing: boolean = true;



  onAccountChange() {
    this.service.gateway.getUser(this.account, '')
      .then(res => {
        this.existing = res.existing;
      });
  }

  onLoginClick() {
    // this.gateway.generateToken(this.account, this.password)
    //   .then(data => {
    //     updateUserEmail(data.email);
    //     saveTokens(data.value, data.refreshToken);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     if (err instanceof HttpErrorResponse) {
    //       this.handleHttpError(err);
    //     }
    //   });
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.type === 'keyup' && event.key === 'Enter') {
      this.onLoginClick();
    }
  }

  onCheckTokens(): void {
    this.service.gateway.validateToken()
    .subscribe(res => {
      this.hasValidTokens = true;
      const exp: Date = timestampToDate(res.expiration);
      const current: Date = new Date();
      const diff = getRemainingTime(current, exp);
      console.log(`Remaining: ${diff.day} days / ${diff.hour} hours / ${diff.minute} minute`);
      this.snackbar.open('Info', `Remaining: ${diff.day} days / ${diff.hour} hours / ${diff.minute} minute`, { duration: SNACKBAR_DURATION });
    })
  }

  onLogout(): void {
    removeTokens();
    this.snackbar.open('info', 'Logout successfully.', { duration: SNACKBAR_DURATION });
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
