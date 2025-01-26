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
import { convertFromBase64, hashString } from '../../sample/toolbox/toolbox.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedModule } from "../../shared/shared.module";
import { debugMode } from '../../storage';
import { IGatewayService } from '../../gateway.service';

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
      if (route.snapshot.queryParamMap.get('message_url')) {
        this.messageUrl = convertFromBase64(route.snapshot.queryParamMap.get('message_url')|| '');
        this.frameResourceUrl = san.bypassSecurityTrustResourceUrl(this.messageUrl);
      }
    }

  ngOnInit(): void {
    this.debugMode = debugMode();
    this.account = localStorage.getItem('cloud77_user_emails') || '';
    if (this.account) {

    }
  }

  account: string = '';

  password = '';

  loginRequired: boolean = true;

  users: string[] = ['user1@example.com','user2@example.com','user3@example.com'];

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
      localStorage.setItem('cloud77_user_emails', this.account);
    }

    this.gateway.generateToken(this.account, this.password)
    .then(data => {
      const key = hashString(data.email);
      localStorage.setItem(`cloud77_access_token_${key}`, data.value);
      localStorage.setItem(`cloud77_refresh_token_${key}`, data.refreshToken);
      sessionStorage.setItem('user_access_token', data.value);
      sessionStorage.setItem('user_refresh_token', data.refreshToken);
    });
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.type === 'keyup' && event.key === 'Enter') {
      this.onLoginClick();
    }
  }

  syncTokens(): void {
    console.log(`${this.messageUrl}?access_token=123&refresh_token=456`);
    this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(`${this.messageUrl}?access_token=123&refresh_token=456`);
    // const key = this.getKey();
    // const accessToken = localStorage.getItem(`cloud77_access_token_${key}`);
    // const refreshToken = localStorage.getItem(`cloud77_refresh_token_${key}`);
    // if (accessToken && refreshToken) {
    //   sessionStorage.setItem('user_access_token', accessToken);
    //   sessionStorage.setItem('user_refresh_token', refreshToken);
    // }
  }
}
