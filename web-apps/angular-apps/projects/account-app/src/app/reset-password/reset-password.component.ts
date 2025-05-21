import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    PasswordStrengthMeterComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    document.title = 'Reset Password';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    // token is empty, need to send email only
  }
  
  email = '';
  token = '';
  
  password = '';
  confirmPassword = '';

  sendToken(): void {
    if (this.email) {
      this.http.post(`/sso-api/users/password-token?email=${this.email}`, {})
        .subscribe((data: any) => {
          console.log(data);
        });
    }
  }

  resetPassword(): void {
    if (this.email && this.password && this.token) {
      this.http.put('/sso-api/users/password', {
        email: this.email,
        password: this.password,
      }, {
        headers: {
          'x-cloud77-onetime-token': this.token
        }
      }).subscribe((data: any) => {
        console.log(data);
      });
    } else {
      // Show error message
    }
  }
}
