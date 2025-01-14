import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

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
    MatAutocompleteModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.email = sessionStorage.getItem('user_email') || '';
  }

  email = '';
  account: string = '';
  
  password = '';

  loginRequired: boolean = true;

  users: string[] = ['user1@example.com','user2@example.com','user3@example.com'];

  onEmailChange(event: any) {
    console.log(event);
  }

  onLoginClick() {
    if (this.account.includes('@')) {
      sessionStorage.setItem('user_email', this.account);
    }

    this.http.post(`/user-app/users/token?email=${this.account}&password=${this.password}`, undefined)
    .subscribe((data: any) => {
      console.log(data);
      sessionStorage.setItem('user_access_token', data.value);
      sessionStorage.setItem('user_refresh_token', data.refreshToken);
    });
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.type === 'keyup' && event.key === 'Enter') {
      this.onLoginClick();
    }
  }
}
