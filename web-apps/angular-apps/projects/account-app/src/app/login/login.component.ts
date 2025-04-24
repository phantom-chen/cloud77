import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { convertFromBase64, getRemainingTime, getTokens, getUserEmail, saveTokens, SharedModule, syncTokens, timestampToDate, updateUserEmail } from "../../../../../src/app/shared";
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
    private http: HttpClient,
    private san: DomSanitizer,
    private router: Router,
    route: ActivatedRoute) {
      this.debugMode = debugMode();

      if (this.debugMode) {
        this.logs += 'Debug Mode\n';
      }

      if (route.snapshot.queryParamMap.get('message_url')) {
        this.messageUrl = convertFromBase64(route.snapshot.queryParamMap.get('message_url')|| '');
        this.logs += `Message url: ${this.messageUrl}\n`;
      }
      
      this.pageTitle = "Go to Account Dashboard";
      if (route.snapshot.queryParamMap.get('page_url')) {
        this.pageUrl = convertFromBase64(route.snapshot.queryParamMap.get('page_url')|| '');
        this.logs += `Page url: ${this.pageUrl}\n`;
        this.pageTitle = `Go to ${this.pageUrl}`;
      }
    }

  ngOnInit(): void {
    // sync local storage to session storage
    const tokens = getTokens();
    this.hasTokens = (tokens.access !== '' && tokens.refresh !== '');

    this.authenticatedAccount = this.authenticatedUsers.length > 0 ? this.authenticatedUsers[0] : '';
    if (getUserEmail(false)) {
      this.account = getUserEmail(false);
    }

    window.addEventListener('message', function(ev) {
      if (ev.data) {
        console.log(ev.data);
        // if (ev.data.request === 'user-login-success' && ev.data.app_url) {
        //   this.window.location.href = ev.data.app_url;
        // }
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
  pageUrl = '';
  pageTitle = '';
  messageUrl = '';
  frameResourceUrl?: SafeResourceUrl;
  debugMode: boolean = false;
  existing: boolean = true;

  onAccountChange() {
    this.gateway.getUser(this.account)
    .then(res => {
      this.existing = res.existing;
    });
  }

  onLoginClick() {
    this.gateway.generateToken(this.account, this.password)
    .then(data => {
      updateUserEmail(data.email, true);
      saveTokens(data.value, data.refreshToken);
      syncTokens();

      setTimeout(() => {
        this.onNavigate();
      }, 1000);
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
    this.router.navigate(['/logout']);
  }

  onNavigate(): void {
    if (this.pageUrl) {
      const tokens = getTokens();
      this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(`${this.messageUrl}?access_token=${tokens.access}&refresh_token=${tokens.refresh}`);
      setTimeout(() => {
        window.location.href = this.pageUrl;
      }, 2000);
    } else {
      this.router.navigate(['/dashboard']);
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
