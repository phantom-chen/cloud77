import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { convertFromBase64 } from '../../sample/toolbox/toolbox.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedModule } from "../../shared/shared.module";
import { addUserEmail, debugMode, getTokens, getUserEmails, removeUserEmail, saveTokens, syncTokens } from '../../storage';
import { IGatewayService } from '../../gateway.service';
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
    route: ActivatedRoute) {
      this.debugMode = debugMode();

      if (this.debugMode) {
        this.logs += 'Debug Mode\n';
      }

      if (route.snapshot.queryParamMap.get('message_url')) {
        this.messageUrl = convertFromBase64(route.snapshot.queryParamMap.get('message_url')|| '');
        this.frameResourceUrl = san.bypassSecurityTrustResourceUrl(this.messageUrl);
        this.logs += `Message url: ${this.messageUrl}\n`;
        console.log(this.messageUrl);
        
      }
    }

  ngOnInit(): void {
    const emails = getUserEmails(false);
    this.users = emails;
    this.authenticatedUsers =  getUserEmails(true);
    this.account = emails.length > 0 ? emails[0] : '';
    this.authenticatedAccount = this.authenticatedUsers.length > 0 ? this.authenticatedUsers[0] : '';
    if (this.account) {

    }

    window.addEventListener('message', function(ev) {
      if (ev.data) {
        console.log(ev.data);
        if (ev.data.request === 'user-login-success' && ev.data.app_url) {
          this.window.location.href = ev.data.app_url;
        }
      }
    });
  }
  remember = true;
  account: string = '';
  authenticatedAccount: string = '';
  password = '';

  loginRequired: boolean = true;

  users: string[] = [];
  authenticatedUsers: string[] = [];
  logs = '';
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
    if (this.account.includes('@')) {
      sessionStorage.setItem('user_email', this.account);
      addUserEmail(this.account);
    }

    this.gateway.generateToken(this.account, this.password)
    .then(data => {
      saveTokens(data.email, data.value, data.refreshToken);
      syncTokens(data.email);
    });
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.type === 'keyup' && event.key === 'Enter') {
      this.onLoginClick();
    }
  }

  clearLogin(): void {
    if (this.account) {
      removeUserEmail(this.account);
      this.users = getUserEmails();
      this.authenticatedUsers = getUserEmails(true);
      this.account = this.users.length > 0 ? this.users[0] : '';
      this.authenticatedAccount = this.authenticatedUsers.length > 0 ? this.authenticatedUsers[0] : '';
    }
  }

  autoLogin(): void {
    if (this.authenticatedAccount) {
      if (this.messageUrl) {
        const tokens = getTokens(this.authenticatedAccount);
        if (tokens.access) {
          this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(`${this.messageUrl}?access_token=${tokens.access}&refresh_token=${tokens.refresh}`);
        }
      } else {
        syncTokens(this.authenticatedAccount);
      }
    }
  }
}
