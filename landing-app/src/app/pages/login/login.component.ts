import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email') || '';
  }

  email = '';

  password = '';

  onEmailChange(event: any) {
    console.log(event);
  }

  onLoginClick() {
    console.log('login clicked');
    console.log(this.email);
    console.log(this.password);
    sessionStorage.setItem('email', this.email);

    this.http.post(`/api/users/token?email=${this.email}&password=${this.password}`, undefined)
    .subscribe((data: any) => {
      console.log(data);
      sessionStorage.setItem('access-token', data.value);
      sessionStorage.setItem('refresh-token', data.refreshToken);
    });
  }
}
